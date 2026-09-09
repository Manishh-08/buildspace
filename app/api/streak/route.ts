import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentUser = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            },
        })

        if (!currentUser) {
            return new NextResponse("User not Found", { status: 404 })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        //get all completed lessons
        const completedLessons = await db.query.progress.findMany({
            where: {
                userId: currentUser.id,
                completed: true,
            }
        })

        const completedDates = new Set<string>();
        completedLessons.forEach((lesson) => {
            if (lesson.completedAt) {
                const date = new Date(lesson.completedAt);
                date.setHours(0, 0, 0, 0);
                completedDates.add(date.toISOString());
            }
        });

        //calculate current streak
        let currentStreak = 0;
        const checkDate = new Date(today);

        while (true) {
            const dateStr = checkDate.toISOString();
            if (completedDates.has(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        //update user's streak in db
        if (currentStreak != currentUser.currentStreak) {
            await db.update(users).set({
                currentStreak: currentStreak,
                longestStreak: Math.max(currentStreak, currentUser.longestStreak),
            })
                .where(
                    eq(users.id, currentUser.id)
                );
        }

        return NextResponse.json({
            currentStreak,
            longestStreak: Math.max(currentStreak, currentUser.longestStreak),
        })

    } catch (error) {
        console.log("[STREAK_GET]", error);
        return NextResponse.json({ currentStreak: 0, longestStreak: 0 });
    }
}