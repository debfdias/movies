"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MovieFormSkeleton from "@/components/MovieFormSkeleton";

export default function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) throw new Error("Failed to fetch movie");
        const movie = await response.json();
        setTitle(movie.title);
        setYear(movie.publishingYear);
        setImageUrl(movie.posterUrl || "");
      } catch (error) {
        console.error("Error fetching movie:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          publishingYear: parseInt(year),
          posterUrl: imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update movie");

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating movie:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <MovieFormSkeleton />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-5xl w-full rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
          <div className="w-full md:w-1/2 p-4 sm:p-6 bg-white border-b md:border-b-0 md:border-r border-gray-700">
            <div className="h-64 sm:h-80 md:h-full w-full flex items-center justify-center shadow-lg rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-200 p-2 sm:p-4">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Movie poster"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No poster available</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 p-4 sm:p-8 bg-[#132b34] flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
              Edit Movie
            </h1>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="space-y-4 sm:space-y-6 flex-1">
                <div className="relative">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block p-3 sm:p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent peer"
                    placeholder=" "
                    required
                    minLength={6}
                  />
                  <label
                    htmlFor="title"
                    className="absolute text-gray-300 duration-300 transform -translate-y-4 scale-75 top-3 sm:top-4 mb-2 z-10 origin-[0] left-3 sm:left-4 peer-focus:left-3 sm:peer-focus:left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Title
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="block p-3 sm:p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent peer"
                    placeholder=" "
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                  <label className="absolute text-gray-300 duration-300 transform -translate-y-4 scale-75 top-3 sm:top-4 z-10 origin-[0] left-3 sm:left-4 peer-focus:left-3 sm:peer-focus:left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                    Publishing Year
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="imageUrl"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="block p-3 sm:p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="imageUrl"
                    className="absolute text-gray-300 duration-300 transform -translate-y-4 scale-75 top-3 sm:top-4 z-10 origin-[0] left-3 sm:left-4 peer-focus:left-3 sm:peer-focus:left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Poster URL
                  </label>
                </div>
              </div>

              <div className="mt-auto pt-6 sm:pt-8">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer flex-1 px-4 py-2 sm:px-6 sm:py-3 border-2 border-white text-white rounded-lg hover:border-[#2BD17E] hover:text-[#2BD17E] text-base sm:text-lg font-medium transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer flex-1 px-4 py-2 sm:px-6 sm:py-3 bg-[#2BD17E] text-white rounded-lg hover:bg-emerald-600 text-base sm:text-lg font-medium transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Update"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
