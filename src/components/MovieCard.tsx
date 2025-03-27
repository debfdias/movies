"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

type MovieCardProps = {
  movie: {
    id: string;
    title: string;
    publishingYear: number;
    posterUrl: string | null;
  };
};

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/movies/${movie.id}`)}
      className="group cursor-pointer transition-all duration-200 hover:scale-105 bg-[#092C39] p-2 rounded-lg hover:bg-[#092C39] "
    >
      <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg bg-gray-100 hover:border-[#2BD17E] hover:border-2">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            unoptimized={true} // Only if you don't need Next.js image optimization
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="mt-2 py-4">
        <h3 className="font-semibold text-2xl truncate mb-4">{movie.title}</h3>
        <p className="font-light">{movie.publishingYear}</p>
      </div>
    </div>
  );
}
