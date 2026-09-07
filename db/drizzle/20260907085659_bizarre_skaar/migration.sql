CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"clerk_id" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE,
	"name" text,
	"username" text UNIQUE,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_active" timestamp
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail" text,
	"duration" integer NOT NULL,
	"points" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"content" text NOT NULL,
	"video_url" text,
	"order" integer NOT NULL,
	"course_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"course_id" text NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"points" integer DEFAULT 50 NOT NULL,
	"criteria" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"achievement_id" text NOT NULL,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "clerk_id_idx" ON "users" ("clerk_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "username_idx" ON "users" ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_enrollment_idx" ON "enrollments" ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "enrollments_user_id_idx" ON "enrollments" ("user_id");--> statement-breakpoint
CREATE INDEX "enrollments_course_id_idx" ON "enrollments" ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_progress_idx" ON "progress" ("user_id","lesson_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_achievement_idx" ON "user_achievements" ("user_id","achievement_id");--> statement-breakpoint
CREATE INDEX "user_achievements_user_id_idx" ON "user_achievements" ("user_id");--> statement-breakpoint
CREATE INDEX "user_achievements_achievement_id_idx" ON "user_achievements" ("achievement_id");--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "achievements"("id") ON DELETE CASCADE;