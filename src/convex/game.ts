import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Player state for the word game: lifetime stars + per-word mastery.
 * Returns null when signed out.
 */
export const getPlayerState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const [statsRow, wordRows] = await Promise.all([
      ctx.db
        .query("playerStats")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first(),
      ctx.db
        .query("wordProgress")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ]);

    return {
      stars: statsRow?.stars ?? 0,
      sessionsCompleted: statsRow?.sessionsCompleted ?? 0,
      words: wordRows.map((row) => ({
        word: row.word,
        correct: row.correct,
        wrong: row.wrong,
        lastPlayedAt: row.lastPlayedAt,
      })),
    };
  },
});

/** Record the outcome of one round for a single word. */
export const recordAnswer = mutation({
  args: { word: v.string(), correct: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    const existing = await ctx.db
      .query("wordProgress")
      .withIndex("by_user_word", (q) =>
        q.eq("userId", userId).eq("word", args.word),
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        correct: existing.correct + (args.correct ? 1 : 0),
        wrong: existing.wrong + (args.correct ? 0 : 1),
        lastPlayedAt: now,
      });
    } else {
      await ctx.db.insert("wordProgress", {
        userId,
        word: args.word,
        correct: args.correct ? 1 : 0,
        wrong: args.correct ? 0 : 1,
        lastPlayedAt: now,
      });
    }
  },
});

/** Add a finished session's stars to the player's lifetime total. */
export const completeSession = mutation({
  args: { stars: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }

    const existing = await ctx.db
      .query("playerStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        stars: existing.stars + args.stars,
        sessionsCompleted: existing.sessionsCompleted + 1,
      });
    } else {
      await ctx.db.insert("playerStats", {
        userId,
        stars: args.stars,
        sessionsCompleted: 1,
      });
    }
  },
});
