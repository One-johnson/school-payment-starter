import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

// ─── GET: All classes or one by ID ───────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const klass = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true, // optional, if you want teacher name, email, etc.
          },
        },
        students: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!klass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(klass);
  }

  const classes = await prisma.class.findMany({
    include: {
      teacher: {
        include: {
          user: true,
        },
      },
      students: {
        include: {
          user: true,
        },
      },
    },
  });

  return NextResponse.json(classes);
}

// ─── POST: Create new class ───────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, teacherId } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Class name is required" },
      { status: 400 }
    );
  }

  const trackingId = generateIds("class");
  const id = generateIds("class");

  const klass = await prisma.class.create({
    data: {
      id,
      name,
      trackingId,
      ...(teacherId && {
        teacher: {
          connect: { userId: teacherId },
        },
      }),
    },
  });

  return NextResponse.json(klass);
}

// ─── PUT: Update class ─────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, teacherId } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Class ID is required" },
      { status: 400 }
    );
  }

  const updated = await prisma.class.update({
    where: { id },
    data: {
      name,
      ...(teacherId && {
        teacher: {
          connect: { userId: teacherId },
        },
      }),
    },
  });

  return NextResponse.json(updated);
}

// ─── DELETE: Delete class ─────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Class ID is required" },
      { status: 400 }
    );
  }

  await prisma.class.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Class deleted" });
}
