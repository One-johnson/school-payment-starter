"use client";

import { useModalStore } from "@/app/store/useModalStore";
import AdminHeader from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import CreateClassForm from "@/components/forms/CreateClassForm";
import ClassTable from "@/components/tables/ClassTable";

export default function Classes() {
  const { open } = useModalStore();

  return (
    <div>
      <AdminHeader />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Class Management</h1>
          <Button
            variant="outline"
            onClick={() => open({ type: "createClass" })}
          >
            Add Class
          </Button>
        </div>

        {/* Class Table */}
        <ClassTable />

        {/* Global dialog for create/edit class */}
        <CreateClassForm />
      </div>
    </div>
  );
}
