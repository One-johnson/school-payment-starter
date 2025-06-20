import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";
// GET All or by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const student = await prisma.user.findUnique({
      where: { id, role: "STUDENT" },
      include: { class: true, payments: true },
    });

    if (!student)
      return NextResponse.json({ error: "Student not found" }, { status: 404 });

    return NextResponse.json(student);
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { class: true, payments: true },
  });

  return NextResponse.json(students);
}

// CREATE student
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, classId, parentPhone, clerkUserId } = body;

  const trackingId = generateIds(name);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );

  const student = await prisma.user.create({
    data: {
      name,
      email,
      role: "STUDENT",
      classId,
      parentPhone,
      clerkUserId,
      trackingId,
    },
  });

  return NextResponse.json(student);
}

// UPDATE student
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  const updated = await prisma.user.update({
    where: { id, role: "STUDENT" },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE student
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await prisma.user.delete({
    where: { id, role: "STUDENT" },
  });

  return NextResponse.json({ message: "Student deleted" });
}
