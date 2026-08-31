// Define "users" table, storing user profile, authentication and gamification data.

import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";



export const users = pgTable("users",{
    id: text("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name"),
    username: text("username").unique(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // Gamififcation
    points: integer("points").default(0).notNull(),
    level: integer("level").default(1).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),
    longestStreak: integer("longest_streak").default(0).notNull(),
    lastActive: timestamp("last_active"),

},(table)=> [
        uniqueIndex("clerk_id_idx").on(table.clerkId),
        uniqueIndex("email_idx").on(table.email),
        uniqueIndex("username_idx").on(table.username)
    ]
);