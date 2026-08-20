"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { createHash } from "node:crypto";

/**
 * Parent progress save / restore (COPPA-safe cross-device sync).
 *
 * The PARENT's email + a 4-digit code lock a snapshot of the child's progress
 * (stars + per-item mastery). The parent can save from one device and restore
 * onto another. The child never provides any personal information, and saving
 * is optional, guest play stays one tap, no account, no email.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_RE = /^\d{4}$/;

/** Deterministic hash so the 4-digit code is never stored in plaintext. */
function hashPin(email: string, pin: string): string {
  return createHash("sha256")
    .update(`${email.trim().toLowerCase()}|${pin.trim()}`)
    .digest("hex");
}

/** Best-effort EmailOctopus subscribe (parent consent opt-in from the UI). */
async function subscribeNewsletter(email: string): Promise<void> {
  const apiKey = process.env.EMAILOCTOPUS_API_KEY;
  const listId = process.env.EMAILOCTOPUS_LIST_ID;
  if (!apiKey || !listId) return;
  try {
    const body = new URLSearchParams({
      api_key: apiKey,
      email_address: email,
      status: "subscribed",
      tags: JSON.stringify(["saved-progress"]),
    });
    const res = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      },
    );
    if (!res.ok && res.status !== 409) {
      console.error(`EmailOctopus subscribe failed (${res.status})`);
    }
  } catch (err) {
    console.error("EmailOctopus subscribe error:", err);
  }
}

/** Save the current player's progress under a parent email + 4-digit code. */
export const saveProgress = action({
  args: {
    email: v.string(),
    pin: v.string(),
    subscribeNewsletter: v.boolean(),
  },
  handler: async (ctx, args): Promise<{ ok: boolean }> => {
    const email = args.email.trim().toLowerCase();
    const pin = args.pin.trim();
    if (!EMAIL_RE.test(email)) {
      throw new Error("That doesn't look like a valid email.");
    }
    if (!PIN_RE.test(pin)) {
      throw new Error("Pick a 4-digit code (e.g. 1234).");
    }

    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");

    const state = await ctx.runQuery(api.game.getPlayerState, {});
    if (state === null) {
      throw new Error("No progress to save yet, play a game first!");
    }

    const now = Date.now();
    await ctx.runMutation(internal.savedProgressCore.upsertSaved, {
      parentEmail: email,
      pinHash: hashPin(email, pin),
      stars: state.stars,
      sessionsCompleted: state.sessionsCompleted,
      items: state.items,
      updatedAt: now,
    });

    await ctx.runMutation(internal.savedProgressCore.linkPlayer, {
      userId,
      linkedEmail: email,
      updatedAt: now,
    });

    if (args.subscribeNewsletter) {
      await subscribeNewsletter(email);
    }

    return { ok: true };
  },
});

/** Restore a saved snapshot onto the current device (must match email + code). */
export const loadProgress = action({
  args: { email: v.string(), pin: v.string() },
  handler: async (ctx, args): Promise<{ ok: boolean }> => {
    const email = args.email.trim().toLowerCase();
    const pin = args.pin.trim();
    if (!EMAIL_RE.test(email)) {
      throw new Error("That doesn't look like a valid email.");
    }
    if (!PIN_RE.test(pin)) {
      throw new Error("Enter your 4-digit code.");
    }

    const saved = await ctx.runQuery(internal.savedProgressCore.getByEmail, {
      email,
    });
    if (saved === null) {
      throw new Error("No saved progress found for that email.");
    }
    if (saved.pinHash !== hashPin(email, pin)) {
      throw new Error("That code doesn't match. Try again.");
    }

    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");

    await ctx.runMutation(internal.savedProgressCore.mergeIntoUser, {
      userId,
      items: saved.items,
      stars: saved.stars,
      sessionsCompleted: saved.sessionsCompleted,
      linkedEmail: email,
    });

    return { ok: true };
  },
});
