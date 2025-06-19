// lib/clerk.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getUserFromClerk() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found in database");

  return user;
}
