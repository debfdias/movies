"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import {
  FiLogOut,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";

type Movie = {
  id: string;
  title: string;
  publishingYear: number;
  posterUrl: string | null;
};

type MoviesResponse = {
  movies: Movie[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export default function DashboardPage() {
  const { status } = useSession();
  const [data, setData] = useState<MoviesResponse>({
    movies: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const limit = 4;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  const fetchMovies = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies?page=${page}&limit=${limit}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchMovies();
    }
  }, [status]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= data.totalPages) {
      fetchMovies(newPage);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-md font-light">
            Welcome, {session?.user?.email}
          </h1>
          <button
            onClick={() => signOut()}
            className="flex items-center cursor-pointer gap-4 hover:text-red-400"
          >
            Logout
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>

        {data.movies.length === 0 && !loading ? (
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
                ? Array.from({ length: limit }).map((_, index) => (
                    <MovieCardSkeleton key={index} />
                  ))
                : data.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
            </div>

            {data.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handlePageChange(data.currentPage - 1)}
                    disabled={data.currentPage === 1}
                    className={`p-2 rounded-md ${
                      data.currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#2BD17E] hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: Math.min(5, data.totalPages) }).map(
                    (_, idx) => {
                      let pageNum;
                      if (data.totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (data.currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (data.currentPage >= data.totalPages - 2) {
                        pageNum = data.totalPages - 4 + idx;
                      } else {
                        pageNum = data.currentPage - 2 + idx;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`cursor-pointer w-10 h-10 rounded-md flex items-center justify-center ${
                            data.currentPage === pageNum
                              ? "bg-[#2BD17E] text-white"
                              : "text-white hover:text-[#2BD17E]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(data.currentPage + 1)}
                    disabled={data.currentPage === data.totalPages}
                    className={` p-2 rounded-md ${
                      data.currentPage === data.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#2BD17E] hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
