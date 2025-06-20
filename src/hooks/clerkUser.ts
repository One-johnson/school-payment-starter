// lib/clerk.ts

import axios from "axios";

interface CreateUserParams {
  email: string;
  name: string;
  role: "STUDENT" | "TEACHER";
}

export async function createUser({
  email,
  name,
  role,
}: CreateUserParams): Promise<string> {
  try {
    const res = await axios.post(
      "https://api.clerk.com/v1/users",
      {
        email_addresses: [{ email_address: email }],
        first_name: name,
        public_metadata: { role },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.id as string; // clerkUserId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(
      "Clerk user creation failed",
      err.response?.data || err.message
    );
    throw new Error("Failed to create Clerk user");
  }
}
