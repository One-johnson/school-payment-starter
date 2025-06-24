import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";
import { auth } from "@clerk/nextjs/server"; // secure Clerk user access

// ─── GET: Get all or one student ─────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            class: { include: { teacher: { include: { user: true } } } },
          },
        },
        payments: true,
      },
    });

    if (!student || student.role !== "STUDENT") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      student: {
        include: {
          class: { include: { teacher: { include: { user: true } } } },
        },
      },
      payments: true,
    },
  });

  return NextResponse.json(students);
}

// ─── POST: Create student ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    email,
    parentPhone,
    guardianName,
    healthNotes,
    isRepeating,
    classId,
  } = body;

  if (!name || !email || !classId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const classExists = await prisma.class.findUnique({ where: { id: classId } });
  if (!classExists) {
    return NextResponse.json({ error: "Invalid class ID" }, { status: 400 });
  }

  const alreadyExists = await prisma.user.findUnique({
    where: { clerkUserId },
  });
  if (alreadyExists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const trackingId = generateIds(name);
  const userId = trackingId;

  await prisma.user.create({
    data: {
      id: userId,
      name,
      email,
      role: "STUDENT",
      clerkUserId,
      trackingId,
    },
  });

  await prisma.student.create({
    data: {
      userId,
      parentPhone,
      guardianName,
      healthNotes,
      isRepeating,
      classId,
    },
  });

  const fullStudent = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      student: {
        include: {
          class: { include: { teacher: { include: { user: true } } } },
        },
      },
      payments: true,
    },
  });

  return NextResponse.json(fullStudent);
}

// ─── PUT: Update student ──────────────────────────────────────
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const {
    id,
    name,
    email,
    parentPhone,
    guardianName,
    healthNotes,
    isRepeating,
    classId,
  } = body;

  if (!id || !name || !email || !classId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const classExists = await prisma.class.findUnique({ where: { id: classId } });
  if (!classExists) {
    return NextResponse.json({ error: "Invalid class ID" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  await prisma.student.update({
    where: { userId: id },
    data: {
      parentPhone,
      guardianName,
      healthNotes,
      isRepeating,
      classId,
    },
  });

  const updatedStudent = await prisma.user.findUnique({
    where: { id },
    include: {
      student: {
        include: {
          class: { include: { teacher: { include: { user: true } } } },
        },
      },
      payments: true,
    },
  });

  return NextResponse.json(updatedStudent);
}

// ─── DELETE: Delete student ───────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await prisma.student.delete({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "Student deleted" });
}
