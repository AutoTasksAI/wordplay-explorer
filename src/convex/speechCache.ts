import {
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { v } from "convex/values";

/** Look up cached TTS audio (base64 mp3) for a normalized phrase. */
export const getAudio = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("audioCache")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return row?.audioBase64 ?? null;
  },
});

export const getAudioInternal = internalQuery({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("audioCache")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return row?.audioBase64 ?? null;
  },
});

export const storeAudioInternal = internalMutation({
  args: { key: v.string(), audioBase64: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("audioCache")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { audioBase64: args.audioBase64 });
    } else {
      await ctx.db.insert("audioCache", {
        key: args.key,
        audioBase64: args.audioBase64,
        createdAt: Date.now(),
      });
    }
  },
});
