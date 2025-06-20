"use client";

import AdminHeader from "@/components/layout/AdminHeader";

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
