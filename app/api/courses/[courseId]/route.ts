import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> } //nextjs provides this param asynchronously thats why Promise wrapped
) {
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

        //get course with lessons
        const course = await db.query.courses.findFirst({
            where: {
                id: courseId
            },
            with: {
                lessons: {
                    orderBy: (lessons, { asc }) => [asc(lessons.order)],
                }
            },
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const enrollment = await db.query.enrollments.findFirst({
            where: {
                userId: dbUser.id,
                courseId: courseId,
            }
        })

        // Get progress for each lesson if enrolled
        let lessonsWithProgress = course.lessons;
        if (enrollment) {
            const lessonIds = course.lessons.map((l) => l.id);
            const userProgress = await db.query.progress.findMany({
                where: {
                    userId: dbUser.id,
                    lessonId: {
                        in: lessonIds,
                    },
                },
            });

            lessonsWithProgress = course.lessons.map((lesson) => ({
                ...lesson,
                completed: userProgress.some(
                    (p) => p.lessonId === lesson.id && p.completed,
                ),
            }));

        } else {
            lessonsWithProgress = course.lessons.map((lesson) => ({
                ...lesson,
                completed: false,
            }));
        }

        return NextResponse.json({
            ...course,
            lessons: lessonsWithProgress,
            enrolled: !!enrollment,
            completed: enrollment?.completed || false,
        });

    } catch (error) {
        console.log("[COURSE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}