import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/hooks/prisma";
import { generateIds } from "@/app/utils/generateIds";

// GET all or by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!payment)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });

    return NextResponse.json(payment);
  }

  const payments = await prisma.payment.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(payments);
}

// CREATE
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, amount, reference, status = "PENDING" } = body;

  const trackingId = generateIds("PAY");

  const payment = await prisma.payment.create({
    data: {
      userId,
      amount,
      reference,
      status,
      trackingId,
    },
  });

  return NextResponse.json(payment);
}

// UPDATE
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;

  const updated = await prisma.payment.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await prisma.payment.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Payment deleted" });
}
