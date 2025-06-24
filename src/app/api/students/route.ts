import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

// ─── GET: Get all or one student ─────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const includeConfig = {
    student: {
      include: {
        class: { include: { teacher: { include: { user: true } } } },
      },
    },
    payments: true,
  };

  if (id) {
    const student = await prisma.user.findUnique({
      where: { id },
      include: includeConfig,
    });

    if (!student || student.role !== "STUDENT") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const flatStudent = {
      id: student.id,
      name: student.name,
      email: student.email,
      role: "STUDENT" as const,
      trackingId: student.trackingId,
      clerkUserId: student.clerkUserId,
      createdAt: student.createdAt,

      parentPhone: student.student?.parentPhone,
      guardianName: student.student?.guardianName,
      healthNotes: student.student?.healthNotes,
      isRepeating: student.student?.isRepeating ?? false,
      classId: student.student?.classId,
      class: student.student?.class
        ? {
            id: student.student.class.id,
            name: student.student.class.name,
            trackingId: student.student.class.trackingId,
            teacher: student.student.class.teacher?.user
              ? {
                  id: student.student.class.teacher.user.id,
                  name: student.student.class.teacher.user.name,
                }
              : undefined,
          }
        : undefined,

      payments: student.payments,
    };

    return NextResponse.json(flatStudent);
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: includeConfig,
  });

  const flatStudents = students.map((student) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    role: "STUDENT" as const,
    trackingId: student.trackingId,
    clerkUserId: student.clerkUserId,
    createdAt: student.createdAt,

    parentPhone: student.student?.parentPhone,
    guardianName: student.student?.guardianName,
    healthNotes: student.student?.healthNotes,
    isRepeating: student.student?.isRepeating ?? false,
    classId: student.student?.classId,
    class: student.student?.class
      ? {
          id: student.student.class.id,
          name: student.student.class.name,
          trackingId: student.student.class.trackingId,
          teacher: student.student.class.teacher?.user
            ? {
                id: student.student.class.teacher.user.id,
                name: student.student.class.teacher.user.name,
              }
            : undefined,
        }
      : undefined,

    payments: student.payments,
  }));

  return NextResponse.json(flatStudents);
}

// ─── POST: Create student ─────────────────────────────────────
export async function POST(req: NextRequest) {
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

  const emailExists = await prisma.user.findUnique({
    where: { email },
  });
  if (emailExists) {
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
      clerkUserId: `placeholder_${userId}`,
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

  const created = await prisma.user.findUnique({
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

  const flat = created && {
    id: created.id,
    name: created.name,
    email: created.email,
    role: "STUDENT" as const,
    trackingId: created.trackingId,
    clerkUserId: created.clerkUserId,
    createdAt: created.createdAt,

    parentPhone: created.student?.parentPhone,
    guardianName: created.student?.guardianName,
    healthNotes: created.student?.healthNotes,
    isRepeating: created.student?.isRepeating ?? false,
    classId: created.student?.classId,
    class: created.student?.class
      ? {
          id: created.student.class.id,
          name: created.student.class.name,
          trackingId: created.student.class.trackingId,
          teacher: created.student.class.teacher?.user
            ? {
                id: created.student.class.teacher.user.id,
                name: created.student.class.teacher.user.name,
              }
            : undefined,
        }
      : undefined,

    payments: created.payments,
  };

  return NextResponse.json(flat);
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

  const updated = await prisma.user.findUnique({
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

  const flat = updated && {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: "STUDENT" as const,
    trackingId: updated.trackingId,
    clerkUserId: updated.clerkUserId,
    createdAt: updated.createdAt,

    parentPhone: updated.student?.parentPhone,
    guardianName: updated.student?.guardianName,
    healthNotes: updated.student?.healthNotes,
    isRepeating: updated.student?.isRepeating ?? false,
    classId: updated.student?.classId,
    class: updated.student?.class
      ? {
          id: updated.student.class.id,
          name: updated.student.class.name,
          trackingId: updated.student.class.trackingId,
          teacher: updated.student.class.teacher?.user
            ? {
                id: updated.student.class.teacher.user.id,
                name: updated.student.class.teacher.user.name,
              }
            : undefined,
        }
      : undefined,

    payments: updated.payments,
  };

  return NextResponse.json(flat);
}

// ─── DELETE: Delete student ───────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await prisma.student.delete({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "Student deleted" });
}
