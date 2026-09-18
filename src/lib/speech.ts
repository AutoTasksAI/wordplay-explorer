/**
 * Voice + sound effects for the kid game.
 *
 * Speech: phrases are played one at a time through a queue so one utterance
 * never cuts another off mid-word. When the Convex TTS integration is
 * configured (ElevenLabs key in the project's Keys tab), phrases are
 * generated with a warm cartoon voice, cached in Convex, and replayed
 * instantly. Until then, or if the API is unreachable, we fall back to the
 * browser's built-in speech synthesis so the game always talks.
 *
 * `speak()` resolves once the phrase has finished playing, so callers can
 * wait for speech to complete before moving on (e.g. let the praise finish
 * before advancing to the next round).
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
/* Audio fetching (base64 mp3 from Convex TTS)                         */
/* ------------------------------------------------------------------ */

const audioCache = new Map<string, string>();
const pendingFetches = new Map<string, Promise<string | null>>();

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
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

/** Drop in-memory TTS audio so a fresh session does not reuse old clips. */
export function clearSpeechCache() {
  audioCache.clear();
  pendingFetches.clear();
  warmQueue.length = 0;
  warming = false;
}

async function drainWarmQueue() {
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
  void drainWarmQueue();
}

/* ------------------------------------------------------------------ */
/* Speech queue: one phrase at a time, never cutting each other off.    */
/* speak() resolves once the phrase has finished playing.               */
/* ------------------------------------------------------------------ */

interface QueueItem {
  key: string;
  text: string;
  opts: { rate?: number; pitch?: number };
  resolve: () => void;
}

const queue: QueueItem[] = [];
let current: QueueItem | null = null;

export function speak(
  text: string,
  opts: { rate?: number; pitch?: number } = {},
): Promise<void> {
  return new Promise((resolve) => {
    const key = normalize(text);
    const last = queue[queue.length - 1];
    if (last && last.key === key) {
      const prev = last.resolve;
      last.resolve = () => { prev(); resolve(); };
      return;
    }
    if (current && current.key === key) {
      const prev = current.resolve;
      current.resolve = () => { prev(); resolve(); };
      return;
    }
    queue.push({ key, text, opts, resolve });
    void drain();
  });
}

async function drain() {
  if (current) return;
  while (queue.length > 0) {
    const item = queue.shift()!;
    current = item;
    try { await playItem(item); } catch {}
    finally { current = null; item.resolve(); }
  }
}

function playItem(item: QueueItem): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    let audio: HTMLAudioElement | null = null;
    let utterance: SpeechSynthesisUtterance | null = null;
    let timer: number | null = null;
    let heartbeat: number | null = null;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (timer !== null) window.clearTimeout(timer);
      if (heartbeat !== null) window.clearInterval(heartbeat);
      if (audio) { audio.onended = null; audio.onerror = null; audio.pause(); }
      if (utterance) {
        utterance.onend = null; utterance.onerror = null;
        try { window.speechSynthesis.cancel(); } catch {}
      }
      resolve();
    };
    const playB64 = (b64: string) => {
      try {
        audio = new Audio(`data:audio/mpeg;base64,${b64}`);
        audio.onended = finish; audio.onerror = finish;
        void audio.play().catch(finish);
        timer = window.setTimeout(finish, 20000);
      } catch { finish(); }
    };
    const playFallback = () => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) { finish(); return; }
      try {
        const synth = window.speechSynthesis;
        synth.cancel();
        window.setTimeout(() => { try { synth.resume(); } catch {} }, 50);
        utterance = new SpeechSynthesisUtterance(item.text);
        const voice = pickVoice();
        if (voice) utterance.voice = voice;
        utterance.rate = item.opts.rate ?? 0.9;
        utterance.pitch = item.opts.pitch ?? 1.15;
        utterance.volume = 1;
        utterance.onend = finish;
        utterance.onerror = finish;
        window.setTimeout(() => synth.speak(utterance!), 100);
        timer = window.setTimeout(finish, 6000);
        heartbeat = window.setInterval(() => {
          try { if (synth.speaking && !synth.paused) { synth.pause(); synth.resume(); } } catch {}
        }, 5000);
      } catch { finish(); }
    };
    const run = async () => {
      try {
        if (convexClient) {
          const b64 = await fetchAudio(item.key);
          if (b64) { playB64(b64); return; }
        }
      } catch {}
      playFallback();
    };
    run().catch(finish);
  });
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const stopSynth = () => { try { window.speechSynthesis.cancel(); } catch {} };
  window.addEventListener("pagehide", stopSynth);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") stopSynth(); });
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null;
  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = enVoices.length > 0 ? enVoices : voices;
  return pool.find((v) => /Samantha|Google US English|Zira|Female|female/i.test(v.name)) ?? pool[0];
}

let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch { return null; }
}
export function warmUpAudio() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.getVoices();
  getAudioCtx();
}
function tone(freq: number, startDelay: number, duration: number, type: OscillatorType = "sine", volume = 0.22) {
  const ctx = getAudioCtx(); if (!ctx) return;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  const start = ctx.currentTime + startDelay;
  osc.type = type; osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(start); osc.stop(start + duration + 0.05);
}
export function playCorrect() { tone(660, 0, 0.14, "triangle", 0.25); tone(990, 0.09, 0.22, "triangle", 0.25); }
export function playWrong() { tone(220, 0, 0.18, "sine", 0.18); }
export function playStar() { tone(1320, 0, 0.1, "sine", 0.18); tone(1760, 0.07, 0.16, "sine", 0.16); }
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, i) => tone(n, i * 0.11, 0.3, "triangle", 0.24));
  tone(1318.5, notes.length * 0.11, 0.5, "triangle", 0.22);
}
export function playBoing() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const start = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(170, start);
  osc.frequency.exponentialRampToValueAtTime(680, start + 0.22);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.24, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(start); osc.stop(start + 0.45);
  tone(1568, 0.26, 0.16, "sine", 0.14);
}
export function playLizard() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const start = ctx.currentTime;
  const chirp = (at: number) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(520, start + at);
    osc.frequency.exponentialRampToValueAtTime(980, start + at + 0.05);
    osc.frequency.exponentialRampToValueAtTime(560, start + at + 0.11);
    gain.gain.setValueAtTime(0.0001, start + at);
    gain.gain.exponentialRampToValueAtTime(0.16, start + at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + at + 0.13);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(start + at); osc.stop(start + at + 0.16);
  };
  chirp(0); chirp(0.16); chirp(0.32); chirp(0.52);
}
export const PRAISE_POOL = [
  "Great job!", "Awesome!", "You got it!", "Super!", "Wow, nice!", "You did it!",
  "Terrific!", "Fantastic!", "Wonderful!", "Amazing!", "Nice work!", "Way to go!",
] as const;
let lastSessionPraise: string | null = null;
function pickPraiseAvoiding(previous: string | null): string {
  const pool = PRAISE_POOL;
  let candidate = pool[Math.floor(Math.random() * pool.length)];
  if (candidate !== previous) return candidate;
  const start = Math.floor(Math.random() * pool.length);
  for (let i = 0; i < pool.length; i++) {
    candidate = pool[(start + i) % pool.length];
    if (candidate !== previous) return candidate;
  }
  return pool[0];
}
export function buildSessionPraises(roundCount: number): string[] {
  const praises: string[] = [];
  let previous: string | null = roundCount > 0 ? lastSessionPraise : null;
  for (let i = 0; i < roundCount; i++) {
    const line = pickPraiseAvoiding(previous);
    praises.push(line);
    previous = line;
  }
  if (praises.length > 0) lastSessionPraise = praises[praises.length - 1];
  return praises;
}
export function formatPraiseUtterance(praise: string, praiseWord: string): string {
  return `${praise} ${praiseWord}!`;
}
export function randomPraise(): string {
  return buildSessionPraises(1)[0] ?? "Great job!";
}
