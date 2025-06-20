"use client";

import { useModalStore } from "@/app/store/useModalStore";
import CreateUserDialog from "@/components/CreateUserForm";
import AdminHeader from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";

export default function Students() {
  const { open } = useModalStore();

  return (
    <div>
      <AdminHeader />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Student Management</h1>
          <Button variant="outline" onClick={() => open("createUser")}>
            Add User
          </Button>
        </div>

        {/* Other dashboard content like tables, stats, etc. */}

        {/* Mount dialog globally here */}
        <CreateUserDialog />
      </div>
    </div>
  );
}
