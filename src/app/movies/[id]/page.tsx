"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
          posterUrl: "",
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Movie Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Release Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border rounded"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Movie Poster URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Current poster"
              className="mt-2 h-40 object-contain"
            />
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Movie"}
          </button>
        </div>
      </form>
    </div>
  );
}
