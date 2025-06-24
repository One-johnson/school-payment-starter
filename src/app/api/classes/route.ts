import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

// ─── GET: All classes or one by ID ───────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const includeConfig = {
    teacher: { include: { user: true } },
    students: { include: { user: true } },
  };

  if (id) {
    const klass = await prisma.class.findUnique({
      where: { id },
      include: includeConfig,
    });

    if (!klass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const { teacher, students, ...rest } = klass;

    const flatKlass = {
      ...rest,
      teacher: teacher
        ? {
            ...teacher.user,
            role: "TEACHER" as const,
            bio: teacher.bio,
            certification: teacher.certification,
            yearsOfExperience: teacher.yearsOfExperience,
          }
        : undefined,
      students: students.map((s) => ({
        name: s.user.name,
        id: s.user.id,
        email: s.user.email,
        role: "STUDENT" as const,
        parentPhone: s.parentPhone,
        guardianName: s.guardianName,
        healthNotes: s.healthNotes,
        isRepeating: s.isRepeating,
        classId: s.classId,
      })),
    };

    return NextResponse.json(flatKlass);
  }

  const classes = await prisma.class.findMany({
    include: includeConfig,
  });

  const flatClasses = classes.map(({ teacher, students, ...rest }) => ({
    ...rest,
    teacher: teacher
      ? {
          ...teacher.user,
          role: "TEACHER" as const,
          bio: teacher.bio,
          certification: teacher.certification,
          yearsOfExperience: teacher.yearsOfExperience,
        }
      : undefined,
    students: students.map((s) => ({
      name: s.user.name,
      id: s.user.id,
      email: s.user.email,
      role: "STUDENT" as const,
      parentPhone: s.parentPhone,
      guardianName: s.guardianName,
      healthNotes: s.healthNotes,
      isRepeating: s.isRepeating,
      classId: s.classId,
    })),
  }));

  return NextResponse.json(flatClasses);
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
