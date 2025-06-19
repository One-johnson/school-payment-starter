import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generateIds } from "@/app/utils/generateIds";
// GET All or by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const teacher = await prisma.user.findUnique({
      where: { id, role: "TEACHER" },
      include: { class: true },
    });

    if (!teacher)
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

    return NextResponse.json(teacher);
  }

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: { class: true },
  });

  return NextResponse.json(teachers);
}

// CREATE
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, classId, clerkUserId } = body;

  const trackingId = generateIds(name);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );

  const teacher = await prisma.user.create({
    data: {
      name,
      email,
      role: "TEACHER",
      classId,
      clerkUserId,
      trackingId,
    },
  });

  return NextResponse.json(teacher);
}

// UPDATE
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  const updated = await prisma.user.update({
    where: { id, role: "TEACHER" },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await prisma.user.delete({
    where: { id, role: "TEACHER" },
  });

  return NextResponse.json({ message: "Teacher deleted" });
}
