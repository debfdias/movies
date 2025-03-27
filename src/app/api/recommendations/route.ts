import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const MovieSchema = z.object({
    title: z.string(),
    year: z.number(),
  });

  const RecommendationsSchema = z.object({
    movies: z.array(MovieSchema),
  });

  try {
    const body = await request.json();
    const { movieName } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a movie expert. Provide exactly 6 movie recommendations similar to the given movie. 
          Return a JSON array with each movie having: title (string), year (number). Don't return any text, just the array of movies.`,
        },
        {
          role: "user",
          content: `Get me 6 movie recommendations similar to "${movieName}". Include title, year.`,
        },
      ],
      response_format: zodResponseFormat(RecommendationsSchema, "event"),
    });

    const content = completion.choices[0]?.message?.content;
    const output = JSON.parse(content || "");

    if (!content) throw new Error("No recommendations found");

    const recommendationsWithPosters = await Promise.all(
      output["movies"]?.map(async (movie: typeof MovieSchema) => {
        try {
          //@ts-expect-error: this is necessary
          const title = movie.title;

          const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              title
            )}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!searchResponse.ok) {
            throw new Error(`TMDB search failed for ${title}`);
          }

          const searchData = await searchResponse.json();
          const firstResult = searchData.results?.[0];

          if (!firstResult) {
            return {
              title,
              year: new Date().getFullYear() - 1,
              posterUrl: "/placeholder-movie.png",
            };
          }

          return {
            title: firstResult.title || title,
            year: firstResult.release_date
              ? new Date(firstResult.release_date).getFullYear()
              : new Date().getFullYear() - 1,
            posterUrl: firstResult.poster_path
              ? `https://image.tmdb.org/t/p/original${firstResult.poster_path}`
              : "/placeholder-movie.png",
          };
        } catch (error) {
          console.error(`Error processing recommendation:`, error);
          return {};
        }
      })
    );

    return NextResponse.json(recommendationsWithPosters);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
