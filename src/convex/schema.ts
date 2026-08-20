import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // per-item mastery for every game module (words, numbers, patterns):
    // keyed by (module, item) so each module tracks its own progress
    itemProgress: defineTable({
      userId: v.id("users"),
      module: v.union(
        v.literal("words"),
        v.literal("numbers"),
        v.literal("patterns"),
      ),
      item: v.string(),
      correct: v.number(),
      wrong: v.number(),
      lastPlayedAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_module_item", ["userId", "module", "item"]),

    // lifetime stats for the player (stars earned, sessions finished).
    // linkedEmail + lastSyncedAt are set when a parent saves/restores the
    // child's progress with their email (parent-facing, COPPA-safe).
    playerStats: defineTable({
      userId: v.id("users"),
      stars: v.number(),
      sessionsCompleted: v.number(),
      linkedEmail: v.optional(v.string()),
      lastSyncedAt: v.optional(v.number()),
    }).index("by_user", ["userId"]),

    // parent-saved progress snapshot for cross-device sync. Keyed by the
    // PARENT's email (never the child's), protected by a 4-digit code.
    // A parent can save the current progress and restore it on another device.
    savedProgress: defineTable({
      parentEmail: v.string(),
      pinHash: v.string(),
      stars: v.number(),
      sessionsCompleted: v.number(),
      items: v.array(
        v.object({
          module: v.union(
            v.literal("words"),
            v.literal("numbers"),
            v.literal("patterns"),
          ),
          item: v.string(),
          correct: v.number(),
          wrong: v.number(),
          lastPlayedAt: v.number(),
        }),
      ),
      updatedAt: v.number(),
    }).index("by_email", ["parentEmail"]),

    // cached TTS audio (base64 mp3) keyed by normalized text, so each word
    // and phrase is generated once and replayed instantly forever after
    audioCache: defineTable({
      key: v.string(),
      audioBase64: v.string(),
      createdAt: v.number(),
    }).index("by_key", ["key"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
