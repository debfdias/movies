"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface RecommendationsCarouselProps {
  currentMovieTitle: string;
  currentMovieId: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
}

export default function RecommendationsCarousel({
  currentMovieTitle,
}: RecommendationsCarouselProps) {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieName: currentMovieTitle }),
        });

        if (!response.ok) throw new Error("Failed to fetch recommendations");

        const data = await response.json();
        setRecommendations(data || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentMovieTitle]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (loading) {
    return (
      <div className="relative mt-12 max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-white">
          You might also like
        </h2>
        <div className="flex gap-4 overflow-x-hidden p-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 h-72 bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-12 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-white">
        You might also like
      </h2>

      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2BD17E] bg-opacity-30 rounded-full p-2 hover:bg-opacity-70 transition-all cursor-pointer"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pl-2 pr-2 snap-x snap-mandatory"
        >
          {recommendations.map((movie, index) => (
            <div
              key={`${movie.title}-${index}`}
              className="flex-shrink-0 w-48 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 bg-gray-800 snap-center"
            >
              <div className="relative aspect-[2/3] bg-gray-800">
                <Image
                  src={movie.posterUrl}
                  alt={`${movie.title} poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-movie.png";
                  }}
                />
              </div>
              <div className="p-3 bg-[#224957]">
                <h3 className="font-semibold text-white truncate">
                  {movie.title}
                </h3>
                <p className="text-gray-300 text-sm">{movie.year}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2BD17E] bg-opacity-30 rounded-full p-2 hover:bg-opacity-70 transition-all cursor-pointer"
          aria-label="Scroll right"
        >
          <FaChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
