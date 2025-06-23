"use client";

import { useModalStore } from "@/app/store/useModalStore";
import AdminHeader from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import StudentForm from "@/components/forms/StudentForm";
import StudentTable from "@/components/tables/StudentTable"; // ✅ Import the table

export default function Students() {
  const { open } = useModalStore();

  return (
    <div>
      <AdminHeader />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Student Management</h1>
          <Button
            variant="outline"
            onClick={() => open({ type: "createStudent" })}
          >
            Add Student
          </Button>
        </div>

        {/* ✅ Student table goes here */}
        <StudentTable />

        {/* ✅ Student modal (create/edit) */}
        <StudentForm />
      </div>
    </div>
  );
}
