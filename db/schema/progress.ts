import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { lessons } from "./lessons";

export const progress = pgTable(
  "progress",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, {
        onDelete: "cascade",
      }),

    completed: boolean("completed")
      .notNull()
      .default(false),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),
  },

  (table) => [
    uniqueIndex("unique_progress_idx").on(
      table.userId,
      table.lessonId,
    ),
  ],
);

