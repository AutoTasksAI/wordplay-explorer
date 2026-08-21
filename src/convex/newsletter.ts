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
 * Env vars (set in the project's Keys tab, never in .env):
 *   EMAILOCTOPUS_API_KEY, EmailOctopus API key (free tier: 2,500 subs)
 *   EMAILOCTOPUS_LIST_ID, the list id for parent subscribers
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

    // EmailOctopus expects a JSON body: status must be uppercase and tags
    // must be a real array (a form-encoded string fails INVALID_PARAMETERS).
    const body = JSON.stringify({
      api_key: API_KEY,
      email_address: email,
      status: "SUBSCRIBED",
      // Send the parent the printable flashcard lead magnet automatically.
      tags: ["lead-magnet-sight-words"],
    });

    try {
      const response = await fetch(
        `https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        },
      );

      const detail = await response.text().catch(() => "");
      // Already on the list is just as good as subscribed.
      if (response.ok || detail.includes("MEMBER_EXISTS_WITH_EMAIL_ADDRESS")) {
        return { ok: true };
      }

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
