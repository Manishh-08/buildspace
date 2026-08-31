
import {
  pgTable,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const courses = pgTable("courses", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  title: text("title")
    .notNull(),

  description: text("description")
    .notNull(),

  thumbnail: text("thumbnail"),

  duration: integer("duration")
    .notNull(),

  points: integer("points")
    .notNull()
    .default(100),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

