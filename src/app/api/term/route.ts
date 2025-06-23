import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

// ─── GET: All or one term ─────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const term = await prisma.term.findUnique({
      where: { id },
      include: {
        payments: {
          include: {
            user: true,
            student: true,
            class: true,
          },
        },
      },
    });

    if (!term) {
      return NextResponse.json({ error: "Term not found" }, { status: 404 });
    }

    return NextResponse.json(term);
  }

  const terms = await prisma.term.findMany({
    orderBy: { startDate: "desc" },
  });

  return NextResponse.json(terms);
}

// ─── POST: Create term ─────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, startDate, endDate } = body;

  if (!name || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (new Date(endDate) < new Date(startDate)) {
    return NextResponse.json(
      { error: "End date must be after start date" },
      { status: 400 }
    );
  }

  const id = generateIds("term");

  const term = await prisma.term.create({
    data: {
      id,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return NextResponse.json(term);
}

// ─── PUT: Update term ─────────────────────────────
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, startDate, endDate } = body;

  if (!id || !name || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const updated = await prisma.term.update({
    where: { id },
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return NextResponse.json(updated);
}

// ─── DELETE: Delete term ─────────────────────────────
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing term ID" }, { status: 400 });
  }

  await prisma.term.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Term deleted" });
}
