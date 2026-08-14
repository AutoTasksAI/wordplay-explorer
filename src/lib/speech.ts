/**
 * Speech + sound effects for the kid game. Everything important in the game
 * is spoken aloud so a 5-year-old can play alone without reading the UI.
 *
 * Speech uses the browser's built-in SpeechSynthesis API (no network,
 * no keys). Sounds are tiny synthesized tones via WebAudio (no assets).
 */

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

/** Pick a pleasant English voice, preferring a child-friendly one. */
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

export function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
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

/** Warm up the speech engine and pick voices (call after first user tap). */
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
