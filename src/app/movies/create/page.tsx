"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AddMoviePage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsSubmitting(true);

    try {
      // First upload image if exists
      const imageUrl =
        "https://cdn.displate.com/artwork/270x380/2024-09-23/fb35d1fc-74ea-4b87-9aa3-a076e4188e8f.jpg";

      // Then save movie data
      await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          publishingYear: parseInt(year),
          posterUrl: imageUrl,
          userId: session.user.id,
        }),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding movie:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-[600px]">
          <div className="w-full md:w-1/2 p-6 bg-red-50 border-r border-gray-200">
            <div className="h-full w-full flex items-center justify-center shadow-lg rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-200 p-4">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Movie poster preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No image selected</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 bg-[#132b34] flex flex-col">
            <h1 className="text-3xl font-bold mb-8">Add New Movie</h1>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="space-y-6 flex-1">
                <div className="relative">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent peer"
                    placeholder=" "
                    required
                    minLength={3}
                  />
                  <label
                    htmlFor="title"
                    className="absolute text-gray-300 duration-300 transform -translate-y-4 scale-75 top-4 mb-2 z-10 origin-[0] left-4 peer-focus:left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Title
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="block p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent peer"
                    placeholder=" "
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                  <label
                    htmlFor="year"
                    className="absolute text-gray-300 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Publishing Year
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    id="poster"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label
                    htmlFor="poster"
                    className="block p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
                  >
                    {image ? image.name : "Select Movie Poster"}
                  </label>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer flex-1 px-6 py-3 border border-white text-white rounded-lg hover:border-[#2BD17E] hover:text-[#2BD17E] text-lg font-medium transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer flex-1 px-6 py-3 bg-[#2BD17E] text-white rounded-lg hover:bg-emerald-600 text-lg font-medium transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Movie"}
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
