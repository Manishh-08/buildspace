import { db } from "@/db/drizzle";
import { enrollments } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> } 
){
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;

        const dbUser = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            },
        })

        if (!dbUser) {
            return new NextResponse("User not Found", { status: 404 })
        }

        const course = await db.query.courses.findFirst({
            where: {
                id: courseId
            },
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const existingEnrollment = await db.query.enrollments.findFirst({
            where: {
                userId: dbUser.id,
                courseId: courseId
            }
        })

        if(existingEnrollment){
            return NextResponse.json({
                message: "Already enrolled",
                enrolled: true,
            })
        }

        const enrollment = await db.insert(enrollments).values({
            userId: dbUser.id,
            courseId: courseId,
            enrolledAt: new Date(),
            completed: false,
        })
        .returning();

        return NextResponse.json({
            success: true,
            enrollment: enrollment[0],
            message: "successfully enrolled in course"
        })

    } catch (error) {
        console.log("[ENROLL_POST]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> } 
){
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;

        const dbUser = await db.query.users.findFirst({
            where: {
                clerkId: userId,
            },
        })

        if (!dbUser) {
            return new NextResponse("User not Found", { status: 404 })
        }

        await db.delete(enrollments)
        .where(
            and(
                eq(enrollments.userId,dbUser.id),
                eq(enrollments.courseId,courseId),
            )
        )

        return NextResponse.json({
            success: true,
            message: "successfully unenrolled from course"
        })

    } catch (error) {
        console.log("[ENROLL_DELETE]",error);
        return new NextResponse("Internal Error", {status: 500});
    }
}