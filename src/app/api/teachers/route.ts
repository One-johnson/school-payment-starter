import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";
import { clerkClient } from "@clerk/nextjs/server";

// ─── GET: Get all or one teacher ─────────────────────────────
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

// ─── POST: Create teacher (Clerk integrated) ─────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, bio, certification, yearsOfExperience } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const trackingId = generateIds("teacher");
  const userId = trackingId;

  try {
    // Create user in Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.createUser({
      emailAddress: [email],
      firstName: name,
      publicMetadata: {
        role: "TEACHER",
      },
    });

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        role: "TEACHER",
        clerkUserId: clerkUser.id,
        trackingId,
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        bio,
        certification,
        yearsOfExperience,
      },
    });

    return NextResponse.json({ ...user, teacher });
  } catch (error) {
    console.error("Clerk error:", error);
    return NextResponse.json(
      { error: "Failed to create teacher in Clerk" },
      { status: 500 }
    );
  }
}

// ─── PUT: Update teacher ─────────────────────────────
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, email, bio, certification, yearsOfExperience } = body;

  if (!id || !name || !email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  const teacher = await prisma.teacher.update({
    where: { userId: id },
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

  if (!id) {
    return NextResponse.json({ error: "Missing teacher ID" }, { status: 400 });
  }

  await prisma.teacher.delete({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "Teacher deleted" });
}
