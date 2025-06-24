"use client";
import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

export default function LandingHero() {
  const { user } = useUser();

  const role = user?.publicMetadata?.role as
    | "ADMIN"
    | "TEACHER"
    | "STUDENT"
    | undefined;
  const roleToPath: Record<"ADMIN" | "TEACHER" | "STUDENT", string> = {
    ADMIN: "/pages/dashboards/admin-dashboard",
    TEACHER: "/pages/dashboards/teacher-dashboard",
    STUDENT: "/pages/dashboards/student-dashboard",
  };

  const dashboardPath = role ? roleToPath[role] : "/dashboard";
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-16 bg-white dark:bg-black">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold">
            Welcome to payFlow
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6">
            Manage school payments seamlessly. Only authorized users can log in.
          </p>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant={"default"}>Log In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              href={dashboardPath}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-sm sm:text-base transition"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-xs text-gray-400 mt-4">
            &copy; {new Date().getFullYear()} Your School Name. All rights
            reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
