import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: params.id, // Directly access params.id
        userId: session.user.id,
      },
    });

    if (!movie) {
      return new NextResponse("Movie not found", { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("[MOVIE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { title, publishingYear, posterUrl } = body;

    const movie = await prisma.movie.update({
      where: {
        id: params.id, // Directly access params.id
        userId: session.user.id,
      },
      data: {
        title,
        publishingYear,
        posterUrl,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("[MOVIE_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
