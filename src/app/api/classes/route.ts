import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

// GET All or by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const klass = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: true,
        students: true,
      },
    });

    if (!klass)
      return NextResponse.json({ error: "Class not found" }, { status: 404 });

    return NextResponse.json(klass);
  }

  const classes = await prisma.class.findMany({
    include: {
      teacher: true,
      students: true,
    },
  });

  return NextResponse.json(classes);
}

// CREATE
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, teacherId } = body;

  const trackingId = generateIds(name);
  const id = generateIds(name + "-id"); // Generate a unique id for the class

  const klass = await prisma.class.create({
    data: {
      id,
      name,
      trackingId,
      ...(teacherId && {
        teacher: {
          connect: { id: teacherId },
        },
      }),
    },
  });
  

  return NextResponse.json(klass);
}

// UPDATE
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  const updated = await prisma.class.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await prisma.class.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Class deleted" });
}
