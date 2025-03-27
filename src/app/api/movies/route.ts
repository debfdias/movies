import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, year, imageUrl, userId } = body;

    const movie = await prisma.movie.create({
      data: {
        title,
        publishingYear: year,
        posterUrl: imageUrl,
        userId,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("[MOVIE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const movies = await prisma.movie.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error("[MOVIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
