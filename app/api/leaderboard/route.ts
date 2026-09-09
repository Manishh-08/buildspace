import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
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

        //get the top hundred users by points
        const leaderboardEntries = await db.query.users.findMany({
            columns: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                points: true,
                level: true,
                currentStreak: true,
            },
            orderBy: (users, { desc }) => [desc(users.points)],
        });

        const entriesWithRank = leaderboardEntries.map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        let userRank = null;
        let userPoints = 0;
        let userLevel = 1;
        let userStreak = 0;

        if (currentUser) {
            userRank = entriesWithRank.findIndex((e) => e.id === currentUser.id) + 1;
            userPoints = currentUser.points;
            userLevel = currentUser.level;
            userStreak = currentUser.currentStreak;
        }

        return NextResponse.json({
            entries: entriesWithRank.slice(0,100),
            userRank: userRank || null,
            userPoints,
            userLevel,
            userStreak,
            totalUsers: leaderboardEntries.length,
        });
    } catch (error) {
        console.error("[LEADERBOARD_GET]", error);
        return NextResponse.json({
            entries: [],
            userRank: null,
            userPoints: 0,
            userLevel: 1,
            userStreak: 0,
        });
    }
}