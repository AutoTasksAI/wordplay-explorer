"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Add a PARENT email address to the Read with Rex parent newsletter list.
 *
 * This is the COPPA-safe way to capture emails: only parents subscribe here
 * (on the parent-facing "For Parents" section of the landing page), never the
 * child and never from inside the game. The child plays in guest mode with no
 * account and no email.
 *
 * Env vars (set in the project's Keys tab — never in .env):
 *   EMAILOCTOPUS_API_KEY — EmailOctopus API key (free tier: 2,500 subs)
 *   EMAILOCTOPUS_LIST_ID — the list id for parent subscribers
 */
const API_KEY = process.env.EMAILOCTOPUS_API_KEY;
const LIST_ID = process.env.EMAILOCTOPUS_LIST_ID;

export const subscribeEmail = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<{ ok: boolean; error?: string }> => {
    const email = args.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "That doesn't look like a valid email." };
    }

    if (!API_KEY || !LIST_ID) {
      return {
        ok: false,
        error: "Newsletter is not configured yet. Please try again later.",
      };
    }

    const body = new URLSearchParams({
      api_key: API_KEY,
      email_address: email,
      status: "subscribed",
      // Send the parent the printable flashcard lead magnet automatically.
      tags: JSON.stringify(["lead-magnet-sight-words"]),
    });

    try {
      const response = await fetch(
        `https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        },
      );

      // 200 = created, 409 = already subscribed (treat as success).
      if (response.ok || response.status === 409) {
        return { ok: true };
      }

      const detail = await response.text().catch(() => "");
      console.error(
        `EmailOctopus subscribe failed (${response.status}): ${detail}`,
      );
      return { ok: false, error: "Something went wrong. Please try again." };
    } catch (err) {
      console.error("EmailOctopus subscribe error:", err);
      return { ok: false, error: "Network error. Please try again." };
    }
  },
});
