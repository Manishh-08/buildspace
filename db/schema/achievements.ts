
import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export type AchievementCriteria =
  | { type: "lessons_completed"; count: number }
  | { type: "courses_completed"; count: number }
  | { type: "streak"; days: number };

export const achievements = pgTable("achievements", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name")
    .notNull()
    .unique(),

  description: text("description")
    .notNull(),

  icon: text("icon")
    .notNull(),

  points: integer("points")
    .notNull()
    .default(50),

  criteria: jsonb("criteria")
    .$type<AchievementCriteria>()
    .notNull(),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    achievementId: text("achievement_id")
      .notNull()
      .references(() => achievements.id, {
        onDelete: "cascade",
      }),

    earnedAt: timestamp("earned_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  (table) => [
    uniqueIndex("unique_user_achievement_idx").on(
      table.userId,
      table.achievementId,
    ),

    index("user_achievements_user_id_idx").on(
      table.userId,
    ),

    index("user_achievements_achievement_id_idx").on(
      table.achievementId,
    ),
  ],
);
