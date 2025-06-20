// pages/dashboard/student/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboard() {
  const { user } = useUser();
  const name = user?.firstName || "Student";
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const role = user?.publicMetadata?.role;

  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {name} 🎓</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Email: <strong>{email}</strong>
          </p>
          <p className="text-muted-foreground">
            Role: <strong>{String(role)}</strong>
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Your class details and payment history will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
