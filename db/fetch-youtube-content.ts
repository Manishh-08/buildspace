import { google, youtube_v3 } from "googleapis";
import * as dotenv from "dotenv";
import { db } from "@/db/drizzle";
import { courses, lessons } from "@/db/schema";

dotenv.config({ path: ".env" });

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const BATCH_SIZE = 50;

type Difficulty = "beginner" | "intermediate" | "advanced";

function calculateDuration(videoCount: number): number {
  return videoCount * 15;
}

function calculatePoints(difficulty: Difficulty, videoCount: number): number {
  const basePoints =
    difficulty === "beginner"
      ? 500
      : difficulty === "intermediate"
        ? 750
        : 1000;
  return basePoints + videoCount * 10;
}

function determineDifficulty(title: string): Difficulty {
  const normalized = title.toLowerCase();

  if (
    normalized.includes("advanced") ||
    normalized.includes("expert") ||
    normalized.includes("master")
  ) {
    return "advanced";
  }

  if (
    normalized.includes("intermediate") ||
    normalized.includes("beyond basics")
  ) {
    return "intermediate";
  }

  return "beginner";
}

async function fetchChannelPlaylists(): Promise<youtube_v3.Schema$Playlist[]> {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not set in .env");
  }

  if (!CHANNEL_ID) {
    throw new Error("YOUTUBE_CHANNEL_ID is not set in .env");
  }

  console.log("📺 Fetching playlists from channel...");

  const allPlaylists: youtube_v3.Schema$Playlist[] = [];
  let pageToken: string | undefined;

  do {
    const { data } = await youtube.playlists.list({
      part: ["snippet", "contentDetails"],
      channelId: CHANNEL_ID,
      maxResults: BATCH_SIZE,
      pageToken,
    });

    allPlaylists.push(...(data.items ?? []));
    pageToken = data.nextPageToken ?? undefined;

    console.log(`  Found ${data.items?.length ?? 0} playlists...`);
  } while (pageToken);

  console.log(`✅ Total playlists found: ${allPlaylists.length}\n`);
  return allPlaylists;
}

async function fetchPlaylistVideos(
  playlistId: string,
  playlistTitle: string,
): Promise<youtube_v3.Schema$PlaylistItem[]> {
  console.log(`  📹 Fetching videos for: ${playlistTitle}`);

  const allVideos: youtube_v3.Schema$PlaylistItem[] = [];
  let pageToken: string | undefined;

  do {
    const { data } = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId,
      maxResults: BATCH_SIZE,
      pageToken,
    });

    allVideos.push(...(data.items ?? []));
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);

  const videos = allVideos.filter((video) => {
    const title = video.snippet?.title ?? "";
    const videoId = video.contentDetails?.videoId;
    const isUnavailable =
      title === "Private video" || title === "Deleted video";

    return Boolean(videoId) && !isUnavailable;
  });

  console.log(`    ✅ Found ${videos.length} videos`);
  return videos;
}

async function seedCoursesFromPlaylists() {
  console.log("🚀 Starting YouTube content import...\n");

  const playlists = await fetchChannelPlaylists();

  const coursePlaylists = playlists.filter((playlist) => {
    const title = playlist.snippet?.title || "";
    const isSystemPlaylist =
      title === "Uploads" || title === "Liked videos" || title === "Favorites";
    return !isSystemPlaylist;
  });

  console.log(`📚 Processing ${coursePlaylists.length} course playlists...\n`);

  let coursesAdded = 0;
  let lessonsAdded = 0;

  for (const playlist of coursePlaylists) {
    const playlistId = playlist.id;
    const snippet = playlist.snippet;
    const contentDetails = playlist.contentDetails;

    if (!playlistId || !snippet) {
      continue;
    }

    const title = snippet.title || "Untitled Course";
    const description =
      snippet.description ||
      `Complete ${title} course for beginners. Learn ${title.toLowerCase()} with practical examples and hands-on projects.`;
    const videoCount = contentDetails?.itemCount || 0;
    const thumbnail =
      snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || null;

    const difficulty = determineDifficulty(title);
    const duration = calculateDuration(videoCount);
    const points = calculatePoints(difficulty, videoCount);

    console.log(`📖 Processing course: ${title}`);
    console.log(
      `    Videos: ${videoCount}, Difficulty: ${difficulty}, XP: ${points}`,
    );

    const existingCourse = await db.query.courses.findFirst({
      where: { title },
    });

    if (existingCourse) {
      console.log(`    ⏭️  Course already exists, skipping...`);
      continue;
    }

    const [course] = await db
      .insert(courses)
      .values({
        title,
        description,
        duration,
        points,
        thumbnail,
      })
      .returning();

    coursesAdded++;

    const videos = await fetchPlaylistVideos(playlistId, title);

    if (videos.length > 0) {
      const lessonValues = videos.map((video, index) => {
        const videoSnippet = video.snippet;
        const videoId = video.contentDetails?.videoId;

        return {
          title: videoSnippet?.title || `Lesson ${index + 1}`,
          content:
            videoSnippet?.description ||
            `Watch this video to learn ${title.toLowerCase()}. Complete tutorial with practical examples.`,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          order: index + 1,
          courseId: course.id,
        };
      });

      await db.insert(lessons).values(lessonValues);
      lessonsAdded += lessonValues.length;
    }

    console.log(`    ✅ Added ${videos.length} lessons\n`);
  }

  console.log("✨ Import complete!");
  console.log(`   📚 Courses added: ${coursesAdded}`);
  console.log(`   📹 Lessons added: ${lessonsAdded}`);
}

seedCoursesFromPlaylists()
  .then(() => {
    console.log("\n✅ YouTube content import finished!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Import failed:", error);
    process.exit(1);
  });
