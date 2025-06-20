import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

// ─── GET: All or one teacher ─────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const teacher = await prisma.user.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            teaches: true,
          },
        },
      },
    });

    if (!teacher || teacher.role !== "TEACHER") {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json(teacher);
  }

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: {
      teacher: {
        include: {
          teaches: true,
        },
      },
    },
  });

  return NextResponse.json(teachers);
}

// ─── POST: Create teacher ─────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, clerkUserId, bio, certification, yearsOfExperience } =
    body;

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
      role: "TEACHER",
      clerkUserId,
      trackingId,
    },
  });

  const teacher = await prisma.teacher.create({
    data: {
      id: user.id,
      bio,
      certification,
      yearsOfExperience,
    },
  });

  return NextResponse.json({ ...user, teacher });
}

// ─── PUT: Update teacher ─────────────────────────────
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, email, bio, certification, yearsOfExperience } = body;

  const user = await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  const teacher = await prisma.teacher.update({
    where: { id },
    data: {
      bio,
      certification,
      yearsOfExperience,
    },
  });

  return NextResponse.json({ ...user, teacher });
}

// ─── DELETE: Delete teacher ─────────────────────────────
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await prisma.teacher.delete({ where: { id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "Teacher deleted" });
}
