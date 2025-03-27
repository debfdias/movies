"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Movie = {
  id: string;
  title: string;
  year: number;
  posterUrl: string | null;
};

export default function DashboardPage() {
  const { status } = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (status === "loading" || status === "unauthenticated" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <button style={{ marginRight: 10 }} onClick={() => signOut()}>
          Sign Out
        </button>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Movies</h1>
          <button
            onClick={() => router.push("/movies/create")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add New Movie
          </button>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No movies added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded-lg shadow overflow-hidden"
                onClick={() => router.push(`/movies/${movie.id}`)}
              >
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{movie.title}</h3>
                  <p className="text-gray-500">{movie.year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
