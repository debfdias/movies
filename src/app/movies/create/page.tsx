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
      console.log(image);
      // First upload image if exists
      const imageUrl =
        "https://cdn.displate.com/artwork/270x380/2024-09-23/fb35d1fc-74ea-4b87-9aa3-a076e4188e8f.jpg";
      // if (image) {
      //   const formData = new FormData();
      //   formData.append("file", image);
      //   formData.append("upload_preset", "your_cloudinary_preset"); // Replace with your Cloudinary preset

      //   const uploadResponse = await fetch(
      //     "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary cloud name
      //     {
      //       method: "POST",
      //       body: formData,
      //     }
      //   );

      //   const uploadedImage = await uploadResponse.json();
      //   imageUrl = uploadedImage.secure_url;
      // }

      // Then save movie data
      await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          year: parseInt(year),
          imageUrl,
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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Movie</h1>

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
          <label className="block text-gray-700 mb-2">Movie Poster</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
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
            {isSubmitting ? "Adding..." : "Add Movie"}
          </button>
        </div>
      </form>
    </div>
  );
}
