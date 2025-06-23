"use client";

import { useModalStore } from "@/app/store/useModalStore";
import AdminHeader from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import TeacherForm from "@/components/forms/TeacherForm"; 
import TeacherTable from "@/components/tables/TeacherTable"; // ✅ Import the table

export default function Teacher() {
  const { open } = useModalStore();

  return (
    <div>
      <AdminHeader />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Teacher Management</h1>
          <Button
            variant="outline"
            onClick={() => open({ type: "createTeacher" })}
          >
            Add Teacher
          </Button>
        </div>

       <TeacherTable />

        {/* Student creation/edit modal */}
        <TeacherForm />
      </div>
    </div>
  );
}
