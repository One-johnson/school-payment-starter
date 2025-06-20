// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function DashboardGate() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const timeout = setTimeout(() => {
      const role = user?.publicMetadata?.role;

      if (role === "ADMIN") router.replace("/pages/dashboard/admin");
      else if (role === "TEACHER") router.replace("/pages/dashboard/teachers");
      else if (role === "STUDENT") router.replace("/pages/dashboard/students");
      else router.replace("/"); // fallback
    }, 1200); // delay in ms

    return () => clearTimeout(timeout);
  }, [user, isLoaded, router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        Redirecting to your dashboard...
      </p>
    </div>
  );
}
