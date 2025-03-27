import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { movieName } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a movie expert. Provide exactly 5 movie recommendations similar to the given movie. Return only a JSON array of movie titles.",
        },
        {
          role: "user",
          content: `Get me 5 movie recommendations similar to "${movieName}". Return only a JSON array.`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    console.log(content);

    if (!content) throw new Error("No recommendations found");

    const recommendations = JSON.parse(content) || [];
    return NextResponse.json({ recommendations });
    return { msg: "ola" };
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
