import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

// ─── GET ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        student: true,
        class: true,
        term: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment);
  }

  const payments = await prisma.payment.findMany({
    include: {
      user: true,
      student: true,
      class: true,
      term: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(payments);
}

// ─── POST ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    userId,
    amount,
    studentId,
    classId,
    termId,
    status = "PENDING",
  } = body;

  if (!userId || !amount) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const id = generateIds("payment");
  const trackingId = generateIds("payment");
  const reference = generateIds("ref");

  const payment = await prisma.payment.create({
    data: {
      id,
      trackingId,
      reference,
      userId,
      amount,
      status,
      ...(studentId && { studentId }),
      ...(classId && { classId }),
      ...(termId && { termId }),
    },
  });

  return NextResponse.json(payment);
}

// ─── PUT ────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
  }

  const updated = await prisma.payment.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// ─── DELETE ────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
  }

  await prisma.payment.delete({ where: { id } });

  return NextResponse.json({ message: "Payment deleted" });
}
