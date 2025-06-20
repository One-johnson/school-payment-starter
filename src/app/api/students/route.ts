// route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

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
            class: true,
            enrolledIn: true,
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
          class: true,
          enrolledIn: true,
        },
      },
      payments: true,
    },
  });

  return NextResponse.json(students);
}

// ─── POST: Create student ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, classId, parentPhone, clerkUserId } = body;

  const trackingId = generateIds(name);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role: "STUDENT",
      clerkUserId,
      trackingId,
    },
  });

  const student = await prisma.student.create({
    data: {
      id: user.id, // Link to User
      parentPhone,
      classId,
    },
  });

  return NextResponse.json({ ...user, student });
}

// ─── PUT: Update student ──────────────────────────────────────
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, email, parentPhone, classId } = body;

  const user = await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  const student = await prisma.student.update({
    where: { id },
    data: {
      parentPhone,
      classId,
    },
  });

  return NextResponse.json({ ...user, student });
}

// ─── DELETE: Delete student ───────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  // Delete Student profile first due to 1:1 relation
  await prisma.student.delete({ where: { id } });

  // Then delete User
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "Student deleted" });
}
