"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import { FiLogOut } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";

type Movie = {
  id: string;
  title: string;
  publishingYear: number;
  posterUrl: string | null;
};

export default function DashboardPage() {
  const { status } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchMovies();
    }
  }, [status]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-md font-light">
            Welcome, {session?.user?.email}
          </h1>
          <button
            onClick={() => signOut()}
            className="flex items-center cursor-pointer gap-4 hover:text-[#2BD17E]"
          >
            Logout
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>

        {movies.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh] -mt-16">
            <h2 className="text-5xl font-bold mb-8 text-center">
              Your movie list is empty
            </h2>
            <button
              onClick={() => router.push("/movies/create")}
              className="cursor-pointer px-6 py-3 bg-[#2BD17E] text-white rounded-lg hover:bg-[#25b871] text-lg font-semibold transition-colors"
            >
              Add a new movie
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-8 items-center mb-24">
              <div className="text-4xl font-bold">My movies</div>
              <button
                onClick={() => router.push("/movies/create")}
                className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#2BD17E] text-white rounded-md hover:bg-[#25b871] text-md font-semibold transition-colors"
              >
                New movie
                <FiPlus className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <MovieCardSkeleton key={index} />
                  ))
                : movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
