"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { uploadImage } from "@/lib/storage/client";
import Image from "next/image";

async function convertBlobUrlToFile(blobUrl: string) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`, {
    type: mimeType,
  });
  return file;
}

export default function AddMoviePage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageUrl(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !imageUrl) return;

    setIsSubmitting(true);

    try {
      startTransition(async () => {
        const imageFile = await convertBlobUrlToFile(imageUrl);

        const { imageUrl: uploadedUrl, error } = await uploadImage({
          file: imageFile,
          bucket: "files",
        });

        if (error) {
          console.error(error);
          return;
        }

        await fetch("/api/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            publishingYear: parseInt(year),
            posterUrl: uploadedUrl,
            userId: session.user.id,
          }),
        });
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding movie:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden mx-2 sm:mx-4">
        <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
          <div className="w-full md:w-1/2 p-4 sm:p-6 bg-white border-b md:border-b-0 md:border-r border-gray-200">
            <div className="h-64 sm:h-80 md:h-full w-full shadow-lg rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-200 p-2">
              {imageUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={imageUrl}
                    alt="Movie poster preview"
                    fill
                    className="object-cover rounded-lg"
                    priority
                    unoptimized={true}
                  />
                </div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center p-4">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    disabled={isPending}
                  />
                  <button
                    className="bg-slate-600 py-2 px-6 rounded-lg text-white hover:bg-slate-700 transition-colors text-sm sm:text-base"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isPending}
                  >
                    Select Image
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 p-4 sm:p-8 bg-[#132b34] flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
              Add New Movie
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
                    minLength={3}
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
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="block p-3 sm:p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent peer"
                    placeholder=" "
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                  />
                  <label
                    htmlFor="year"
                    className="absolute text-gray-300 duration-300 transform -translate-y-4 scale-75 top-3 sm:top-4 z-10 origin-[0] left-3 sm:left-4 peer-focus:left-3 sm:peer-focus:left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Publishing Year
                  </label>
                </div>
              </div>

              <div className="mt-auto pt-6 sm:pt-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-white text-white rounded-lg hover:border-[#2BD17E] hover:text-[#2BD17E] text-base sm:text-lg font-medium transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-[#2BD17E] text-white rounded-lg hover:bg-emerald-600 text-base sm:text-lg font-medium transition-colors disabled:opacity-50"
                    disabled={isSubmitting || !imageUrl}
                  >
                    {isSubmitting || isPending ? "Adding..." : "Add Movie"}
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
