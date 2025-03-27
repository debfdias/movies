import React from "react";

export default function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg bg-gray-200">
        <div className="absolute inset-0 bg-[#1b5c74]" />
      </div>

      <div className="mt-2 space-y-2">
        <div className="h-5 bg-[#1b5c74] rounded w-3/4"></div>
        <div className="h-4 bg-[#1b5c74] rounded w-1/2"></div>
      </div>
    </div>
  );
}
