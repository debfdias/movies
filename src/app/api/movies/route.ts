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
    const { title, publishingYear, imageUrl, userId } = body;

    const movie = await prisma.movie.create({
      data: {
        title,
        publishingYear,
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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    const [movies, totalCount] = await Promise.all([
      prisma.movie.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.movie.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      movies,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("[MOVIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
