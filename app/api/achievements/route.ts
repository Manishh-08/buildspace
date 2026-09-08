import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const dbUser = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            },
        })

        if(!dbUser){
            return new NextResponse("User not Found", {status: 404})
        }

        const allAchievements = await db.query.achievements.findMany();

        const userAchievementsList = await db.query.userAchievements.findMany({
            where: {
                userId: dbUser.id,
            },
        });

        const earnedAchievementsIds = new Set(
            userAchievementsList.map((ua)=> ua.achievementId)
        );

        const achievementsWithStatus = allAchievements.map((achievement)=> ({
            ...achievement,
            earned: earnedAchievementsIds.has(achievement.id),
            earnedAt: userAchievementsList.find(
                (ua) => ua.achievementId === achievement.id,
            )?.earnedAt,
        }));
        
        return NextResponse.json(achievementsWithStatus);
    } catch (error) {
        console.log("[ACHIEVEMENTS_GET",error);
        return new NextResponse("Internal Error",{status: 500});
    }
}