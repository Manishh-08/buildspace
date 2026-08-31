import { defineRelations } from "drizzle-orm";

import { users } from "./users";
import { courses } from "./courses";
import { lessons } from "./lessons";
import { enrollments } from "./enrollments";
import {
  achievements,
  userAchievements,
} from "./achievements";

export const relations = defineRelations(
  {
    users,
    courses,
    lessons,
    enrollments,
    achievements,
    userAchievements,
  },
  (r) => ({
    // Users
    users: {
      enrollments: r.many.enrollments(),
      achievements: r.many.userAchievements(),
    },

    // Courses
    courses: {
      lessons: r.many.lessons(),
      enrollments: r.many.enrollments(),
    },

    // Lessons
    lessons: {
      course: r.one.courses({
        from: r.lessons.courseId,
        to: r.courses.id,
      }),
    },

    // Enrollments
    enrollments: {
      user: r.one.users({
        from: r.enrollments.userId,
        to: r.users.id,
      }),

      course: r.one.courses({
        from: r.enrollments.courseId,
        to: r.courses.id,
      }),
    },

    // Achievements
    achievements: {
      users: r.many.userAchievements(),
    },

    // User achievements
    userAchievements: {
      user: r.one.users({
        from: r.userAchievements.userId,
        to: r.users.id,
      }),

      achievement: r.one.achievements({
        from: r.userAchievements.achievementId,
        to: r.achievements.id,
      }),
    },
  }),
);

