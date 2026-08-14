"use node";

import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Cartoon-style text-to-speech via ElevenLabs, cached per phrase so each
 * word/praise is generated exactly once and replayed instantly forever.
 *
 * Env vars (set in the project's Keys tab):
 *   ELEVENLABS_API_KEY  — required; the free tier is plenty for this app
 *   ELEVENLABS_VOICE_ID — optional; defaults to Bella (warm, gentle, clear).
 *                         Kid/cartoon alternatives:
 *                           Elli     MF3mGyEYCl7XYWbV9V6O (young, playful)
 *                           Matilda  XrExE9yKIg1WjnnlVkGX (storyteller)
 */

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID ?? "EXAVITQu4vr4xnSDxMaL"; // Bella

/**
 * Fetch (or generate + cache) audio for a phrase. Returns base64 mp3 or
 * throws if the API key is missing/unreachable — the client falls back to
 * the browser's built-in speech in that case.
 */
export const synthesizeSpeech = action({
  args: { text: v.string(), key: v.string() },
  handler: async (ctx, args): Promise<string> => {
    const cached: string | null = await ctx.runQuery(
      internal.speechCache.getAudioInternal,
      {
        key: args.key,
      },
    );
    if (cached) return cached;

    if (!API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: args.text,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.35,
            similarity_boost: 0.8,
            style: 0.4,
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`ElevenLabs request failed (${response.status}): ${detail}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const audioBase64 = buffer.toString("base64");

    await ctx.runMutation(internal.speechCache.storeAudioInternal, {
      key: args.key,
      audioBase64,
    });

    return audioBase64;
  },
});
