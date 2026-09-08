import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
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

        if (!dbUser) {
            return new NextResponse("User not Found", { status: 404 })
        }

        // Get all courses with enrollment status
        const allCourses = await db.query.courses.findMany({
            with: {
                lessons: true,
                enrollments: {
                    where: {
                        userId: dbUser.id
                    }
                }
            }
        })

        const formattedCourses = allCourses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail: course.thumbnail,
            duration: course.duration,
            points: course.points,
            totalLessons: course.lessons.length,
            enrolled: course.enrollments.length > 0,
            progress: 0,
        }));

        return NextResponse.json(formattedCourses);

    } catch (error) {
        console.log("[COURSES_GET]",error);
        return NextResponse.json([]);
    }
}