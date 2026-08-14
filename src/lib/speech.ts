/**
 * Voice + sound effects for the kid game.
 *
 * Speech: phrases are played one at a time through a queue so one utterance
 * never cuts another off mid-word. When the Convex TTS integration is
 * configured (ElevenLabs key in the project's Keys tab), phrases are
 * generated with a warm cartoon voice, cached in Convex, and replayed
 * instantly. Until then — or if the API is unreachable — we fall back to the
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
    // Coalesce duplicate phrases: if the exact same phrase is already queued
    // (or playing right now), don't add another copy — resolve together with
    // it when it finishes. Rapid repeat taps should never make the voice loop
    // the same line over and over.
    const last = queue[queue.length - 1];
    if (last && last.key === key) {
      const prev = last.resolve;
      last.resolve = () => {
        prev();
        resolve();
      };
      return;
    }
    if (current && current.key === key) {
      const prev = current.resolve;
      current.resolve = () => {
        prev();
        resolve();
      };
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
    try {
      await playItem(item);
    } catch {
      /* never let one bad phrase stall the queue */
    } finally {
      current = null;
      item.resolve();
    }
  }
}

/** Play one phrase to completion (or give up quietly after a timeout). */
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
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
      if (utterance) {
        utterance.onend = null;
        utterance.onerror = null;
        // Stop any ghost utterance the browser may keep looping after onend
        // or a timeout (a known Chrome speechSynthesis bug).
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* ignore */
        }
      }
      resolve();
    };

    /** Play a cached base64 mp3, resolving when it finishes. */
    const playB64 = (b64: string) => {
      try {
        audio = new Audio(`data:audio/mpeg;base64,${b64}`);
        audio.onended = finish;
        audio.onerror = finish;
        void audio.play().catch(finish);
        timer = window.setTimeout(finish, 20000);
      } catch {
        finish();
      }
    };

    /** Browser speech fallback, resolving when the utterance ends. */
    const playFallback = () => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        finish();
        return;
      }
      try {
        const synth = window.speechSynthesis;
        synth.cancel();
        utterance = new SpeechSynthesisUtterance(item.text);
        const voice = pickVoice();
        if (voice) utterance.voice = voice;
        utterance.rate = item.opts.rate ?? 0.9;
        utterance.pitch = item.opts.pitch ?? 1.15;
        utterance.volume = 1;
        utterance.onend = finish;
        utterance.onerror = finish;
        // Chrome drops an utterance spoken immediately after cancel(); a tick fixes it.
        window.setTimeout(() => synth.speak(utterance!), 30);
        timer = window.setTimeout(finish, 20000);
        // Chrome has a known bug where speechSynthesis gets "stuck" speaking
        // or loops a phrase; a gentle pause/resume heartbeat keeps it moving.
        heartbeat = window.setInterval(() => {
          try {
            if (synth.speaking && !synth.paused) {
              synth.pause();
              synth.resume();
            }
          } catch {
            /* ignore */
          }
        }, 5000);
      } catch {
        finish();
      }
    };

    const run = async () => {
      try {
        if (convexClient) {
          const b64 = await fetchAudio(item.key);
          if (b64) {
            playB64(b64);
            return;
          }
        }
      } catch {
        /* fall through to the browser voice */
      }
      playFallback();
    };
    // Never let an unexpected throw leave the queue stalled.
    run().catch(finish);
  });
}

// Stop speech when the tab is hidden — Chrome can otherwise keep a stuck
// utterance looping in the background.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const stopSynth = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  };
  window.addEventListener("pagehide", stopSynth);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") stopSynth();
  });
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
