"use client";

import { useState, useEffect, useRef, MouseEventHandler } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

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
  const sliderRef = useRef<Slider>(null);

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(4, recommendations.length),
    slidesToScroll: 1,
    initialSlide: 0,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, recommendations.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, recommendations.length),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  function SampleNextArrow(props: ArrowProps) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2BD17E] bg-opacity-30 rounded-full p-2 hover:bg-opacity-70 transition-all cursor-pointer"
        aria-label="Next"
      >
        <FaChevronRight className="w-5 h-5 text-white" />
      </button>
    );
  }

  function SamplePrevArrow(props: ArrowProps) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2BD17E] bg-opacity-30 rounded-full p-2 hover:bg-opacity-70 transition-all cursor-pointer"
        aria-label="Previous"
      >
        <FaChevronLeft className="w-5 h-5 text-white" />
      </button>
    );
  }

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

      <div className="relative px-10">
        <Slider {...settings} ref={sliderRef}>
          {recommendations.map((movie, index) => (
            <div key={`${movie.title}-${index}`} className="px-2">
              <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 bg-gray-800">
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
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
