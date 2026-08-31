import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { courses } from "./courses";

export const enrollments = pgTable(
  "enrollments",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
      }),

    enrolledAt: timestamp("enrolled_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    completed: boolean("completed")
      .notNull()
      .default(false),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),
  },

  (table) => [
    uniqueIndex("unique_enrollment_idx").on(
      table.userId,
      table.courseId,
    ),

    index("enrollments_user_id_idx").on(
      table.userId,
    ),

    index("enrollments_course_id_idx").on(
      table.courseId,
    ),
  ],
);
