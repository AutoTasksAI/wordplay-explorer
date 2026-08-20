import { getAuthUserId } from "@convex-dev/auth/server";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { MODULE_VALIDATOR } from "./game";

/**
 * Saved-progress plumbing used by the save/restore actions in savedProgress.ts.
 * This file deliberately has NO "use node" action so queries + mutations can
 * live together. Actions live in savedProgress.ts.
 */

const ITEM_VALIDATOR = v.object({
  module: MODULE_VALIDATOR,
  item: v.string(),
  correct: v.number(),
  wrong: v.number(),
  lastPlayedAt: v.number(),
});

/** Find a saved snapshot by parent email (used internally by loadProgress). */
export const getByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("savedProgress")
      .withIndex("by_email", (q) => q.eq("parentEmail", args.email))
      .first();
    return doc;
  },
});

/** Create or overwrite a parent's saved snapshot (used by saveProgress). */
export const upsertSaved = internalMutation({
  args: {
    parentEmail: v.string(),
    pinHash: v.string(),
    stars: v.number(),
    sessionsCompleted: v.number(),
    items: v.array(ITEM_VALIDATOR),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("savedProgress")
      .withIndex("by_email", (q) => q.eq("parentEmail", args.parentEmail))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args });
    } else {
      await ctx.db.insert("savedProgress", { ...args });
    }
  },
});

/** Remember which parent email this player's progress is linked to. */
export const linkPlayer = internalMutation({
  args: {
    userId: v.id("users"),
    linkedEmail: v.string(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("playerStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (stats) {
      await ctx.db.patch(stats._id, {
        linkedEmail: args.linkedEmail,
        lastSyncedAt: args.updatedAt,
      });
    } else {
      await ctx.db.insert("playerStats", {
        userId: args.userId,
        stars: 0,
        sessionsCompleted: 0,
        linkedEmail: args.linkedEmail,
        lastSyncedAt: args.updatedAt,
      });
    }
  },
});

/** Merge a saved snapshot into the current player (used by loadProgress).
 *  Item progress keeps the best (max) counts, and stars/sessions never shrink. */
export const mergeIntoUser = internalMutation({
  args: {
    userId: v.id("users"),
    items: v.array(ITEM_VALIDATOR),
    stars: v.number(),
    sessionsCompleted: v.number(),
    linkedEmail: v.string(),
  },
  handler: async (ctx, args) => {
    for (const it of args.items) {
      const existing = await ctx.db
        .query("itemProgress")
        .withIndex("by_user_module_item", (q) =>
          q
            .eq("userId", args.userId)
            .eq("module", it.module)
            .eq("item", it.item),
        )
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          correct: Math.max(existing.correct, it.correct),
          wrong: Math.max(existing.wrong, it.wrong),
          lastPlayedAt: Math.max(existing.lastPlayedAt, it.lastPlayedAt),
        });
      } else {
        await ctx.db.insert("itemProgress", {
          userId: args.userId,
          module: it.module,
          item: it.item,
          correct: it.correct,
          wrong: it.wrong,
          lastPlayedAt: it.lastPlayedAt,
        });
      }
    }

    const stats = await ctx.db
      .query("playerStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (stats) {
      await ctx.db.patch(stats._id, {
        stars: Math.max(stats.stars, args.stars),
        sessionsCompleted: Math.max(
          stats.sessionsCompleted,
          args.sessionsCompleted,
        ),
        linkedEmail: args.linkedEmail,
        lastSyncedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("playerStats", {
        userId: args.userId,
        stars: args.stars,
        sessionsCompleted: args.sessionsCompleted,
        linkedEmail: args.linkedEmail,
        lastSyncedAt: Date.now(),
      });
    }
  },
});

/** Whether this device's player is linked to a saved parent snapshot. */
export const getLinkStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const stats = await ctx.db
      .query("playerStats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return {
      linkedEmail: stats?.linkedEmail ?? null,
      lastSyncedAt: stats?.lastSyncedAt ?? null,
    };
  },
});
