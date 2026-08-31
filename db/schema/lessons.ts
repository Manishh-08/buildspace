import {
  pgTable,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { courses } from "./courses";

export const lessons = pgTable("lessons", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  title: text("title")
    .notNull(),

  content: text("content")
    .notNull(),

  // YouTube or other video URL
  videoUrl: text("video_url"),

  order: integer("order")
    .notNull(),

  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

