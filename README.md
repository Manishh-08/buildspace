<img width="1241" height="675" alt="Screenshot 2026-09-20 at 2 43 36 AM" src="https://github.com/user-attachments/assets/fd4ba059-c873-4ee9-9d94-c17f0eace636" />
# BuildSpace

BuildSpace is a full-stack learning platform I built to make online learning a little more engaging.

The idea was to go beyond just watching lessons. Users can enroll in courses, keep track of their progress, earn XP, maintain learning streaks, unlock achievements, and see how they compare on the leaderboard.

## Live Demo

https://buildspace-wine.vercel.app/

## What can you do with it?

- Create an account and sign in securely
- Browse and enroll in courses
- Complete lessons and track your progress
- Earn XP as you learn
- Level up based on your XP
- Maintain a daily learning streak
- Unlock achievements by completing different goals
- Check your position on the leaderboard
- View your learning statistics and profile

## Screenshots

<img width="1241" height="675" alt="Screenshot 2026-09-20 at 2 43 36 AM" src="https://github.com/user-attachments/assets/7d820a24-9187-43cb-afd1-c09d5eeaa223" />


## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Lucide React

### Backend & Database

- Next.js API Routes
- PostgreSQL
- Drizzle ORM
- Clerk Authentication

### Deployment

- Vercel

## A little about how it works

The application uses Clerk for authentication and PostgreSQL for storing the application's data.

When a user completes a lesson, the backend updates their progress and awards XP. The system also updates their learning streak and checks whether they've unlocked any new achievements.

The leaderboard is generated from the users' XP and shows their current rank, level, and streak.

TanStack Query handles the data coming from the backend on the client side, including caching, loading states, and refreshing data when something changes.

## Database

The main tables in the database are:

- Users
- Courses
- Lessons
- Enrollments
- Progress
- Achievements
- User Achievements

The database is managed using Drizzle ORM with PostgreSQL.
