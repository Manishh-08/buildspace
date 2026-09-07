import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { currentUser, auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST() {
    try {
        const { userId } = await auth(); // this gives you currently logged in userid
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        //check if the user exists in db
        const existingUser = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            },
        })

        const email = clerkUser.emailAddresses[0].emailAddress;
        const name = clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
            : clerkUser.username || email?.split('@')[0] || "Learner";

        if (!existingUser) {
            const [newUser] = await db.insert(users).values({
                clerkId: userId,
                email: email,
                name: name,
                username: clerkUser.username || email?.split('@')[0] || "Learner",
                avatarUrl: clerkUser.imageUrl,
                points: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0,
                lastActive: new Date()
            })
                .returning();

            return NextResponse.json({
                success: true,
                user: newUser,
                message: "User created successfully",
            });
        } else {
            const [updatedUser] = await db.update(users).set({
                name: name,
                email: email,
                username: clerkUser.username || email?.split('@')[0] || "Learner",
                avatarUrl: clerkUser.imageUrl,
                updatedAt: new Date(),
            }).where(eq(users.clerkId, userId))
                .returning();

            return NextResponse.json({
                success: true,
                user: updatedUser,
                message: "User updated successfully",
            });
        }

    } catch (error) {
        console.log("[USER_SYNC]", error);

        return NextResponse.json(
            {
                error: "Failed to sync user",
                details: error
            },
            { status: 500 }
        );
    }

}