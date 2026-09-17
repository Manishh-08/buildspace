import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Clock, Star } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  duration: number;
  progress?: number;
  points: number;
}

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  duration,
  progress = 0,
  points,
}: CourseCardProps) {
  const imageUrl = thumbnail && !thumbnail.includes("example.com")
    ? thumbnail
    : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop";

  return (
    <Link href={`/courses/${id}`}>
      <Card
        className={cn(
          "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden",
          "p-0", // Remove all padding from Card
        )}
      >

        {/* Image Container - Fixed aspect ratio, no extra padding */}
        <div className="relative w-full aspect-video overflow-hidden bg-linear-to-br from-purple-600 to-indigo-600">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-100"
          />
          {/* image overlay for subtle contrast */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <CardContent className="p-4">
          <h1 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{points} XP</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}