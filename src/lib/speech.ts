/**
 * Voice + sound effects for the kid game.
 *
 * Speech: when the Convex TTS integration is configured (ElevenLabs key in
 * the project's Keys tab), phrases are generated with a warm cartoon voice,
 * cached in Convex, and replayed instantly. Until then — or if the API is
 * unreachable — we fall back to the browser's built-in speech synthesis so
 * the game always talks.
 *
 * Sounds: tiny synthesized tones via WebAudio (no assets, no keys).
 */

import { api } from "@/convex/_generated/api";
import type { ConvexReactClient } from "convex/react";

let convexClient: ConvexReactClient | null = null;

/** Called once at app boot with the Convex client so speech can fetch audio. */
export function setSpeechClient(client: ConvexReactClient | null) {
  convexClient = client;
}

/* ------------------------------------------------------------------ */
/* Audio playback (base64 mp3 from Convex TTS)                         */
/* ------------------------------------------------------------------ */

const audioCache = new Map<string, string>();
const pendingFetches = new Map<string, Promise<string | null>>();
let currentAudio: HTMLAudioElement | null = null;

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function playBase64(b64: string) {
  try {
    currentAudio?.pause();
    const audio = new Audio(`data:audio/mpeg;base64,${b64}`);
    currentAudio = audio;
    void audio.play().catch(() => {});
  } catch {
    /* ignore playback errors */
  }
}

async function fetchAudio(key: string): Promise<string | null> {
  const cached = audioCache.get(key);
  if (cached) return cached;
  const inflight = pendingFetches.get(key);
  if (inflight) return inflight;
  if (!convexClient) return null;

  const promise = (async () => {
    try {
      let b64 = await convexClient.query(api.speechCache.getAudio, { key });
      if (!b64) {
        b64 = await convexClient.action(api.speech.synthesizeSpeech, {
          text: key,
          key,
        });
      }
      if (b64) {
        audioCache.set(key, b64);
        return b64;
      }
    } catch (err) {
      console.warn("[speech] TTS unavailable, using fallback voice:", err);
    }
    return null;
  })();

  pendingFetches.set(key, promise);
  try {
    return await promise;
  } finally {
    pendingFetches.delete(key);
  }
}

/* ------------------------------------------------------------------ */
/* Warm-up queue: pre-generate a session's audio in the background so   */
/* rounds play instantly.                                               */
/* ------------------------------------------------------------------ */

const warmQueue: string[] = [];
let warming = false;

async function drainQueue() {
  if (warming) return;
  warming = true;
  while (warmQueue.length > 0) {
    const key = warmQueue.shift()!;
    try {
      await fetchAudio(key);
    } catch {
      /* keep going */
    }
  }
  warming = false;
}

/** Queue keys (normalized text) to pre-fetch so playback is instant. */
export function warmUpSpeech(keys: string[]) {
  for (const key of keys) {
    if (!audioCache.has(key)) warmQueue.push(key);
  }
  void drainQueue();
}

/* ------------------------------------------------------------------ */
/* speak(): cartoon voice first, browser voice as fallback              */
/* ------------------------------------------------------------------ */

function speakFallback(text: string, opts: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = opts.rate ?? 0.9;
  utterance.pitch = opts.pitch ?? 1.15;
  utterance.volume = 1;
  // Chrome drops an utterance spoken immediately after cancel(); a tick fixes it.
  window.setTimeout(() => synth.speak(utterance), 30);
}

export async function speak(
  text: string,
  opts: { rate?: number; pitch?: number } = {},
) {
  const key = normalize(text);
  if (convexClient) {
    const b64 = await fetchAudio(key);
    if (b64) {
      playBase64(b64);
      return;
    }
  }
  speakFallback(text, opts);
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null;
  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = enVoices.length > 0 ? enVoices : voices;
  return (
    pool.find((v) => /Samantha|Google US English|Zira|Female|female/i.test(v.name)) ??
    pool[0]
  );
}

/* ------------------------------------------------------------------ */
/* WebAudio sound effects (unchanged from before)                      */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/** Warm up audio engines after the first user tap. */
export function warmUpAudio() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
  getAudioCtx();
}

function tone(
  freq: number,
  startDelay: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.22,
) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + startDelay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** Bright two-note "ding!" for a correct answer. */
export function playCorrect() {
  tone(660, 0, 0.14, "triangle", 0.25);
  tone(990, 0.09, 0.22, "triangle", 0.25);
}

/** Soft low "boop" for a wrong answer — gentle, never scary. */
export function playWrong() {
  tone(220, 0, 0.18, "sine", 0.18);
}

/** Little sparkle when a star pops. */
export function playStar() {
  tone(1320, 0, 0.1, "sine", 0.18);
  tone(1760, 0.07, 0.16, "sine", 0.16);
}

/** Big celebration arpeggio for finishing a session. */
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, i) => tone(n, i * 0.11, 0.3, "triangle", 0.24));
  tone(1318.5, notes.length * 0.11, 0.5, "triangle", 0.22);
}

/** Bouncy "boing!" for milestone celebrations (20 stars, 40 stars...). */
export function playBoing() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const start = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(170, start);
  osc.frequency.exponentialRampToValueAtTime(680, start + 0.22);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.24, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.45);
  tone(1568, 0.26, 0.16, "sine", 0.14);
}

const PRAISES = [
  "Great job!",
  "Awesome!",
  "You got it!",
  "Super!",
  "Wow, nice!",
  "You did it!",
];

export function randomPraise(): string {
  return PRAISES[Math.floor(Math.random() * PRAISES.length)];
}
