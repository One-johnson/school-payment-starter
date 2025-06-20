// components/dialogs/CreateUserDialog.tsx
"use client";

import { useState } from "react";
import { useModalStore } from "@/app/store/useModalStore";
import { useStudentStore } from "@/app/store/useStudentStore";
import { useTeacherStore } from "@/app/store/useTeacherStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/hooks/clerkUser"; // You will create this utility

export default function CreateUserDialog() {
  const { openModal, close } = useModalStore();
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [form, setForm] = useState({ name: "", email: "", parentPhone: "" });
  const [loading, setLoading] = useState(false);

  const { createStudent } = useStudentStore();
  const { createTeacher } = useTeacherStore();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Create user in Clerk and get clerkUserId
      const clerkUserId = await createUser({
        email: form.email,
        name: form.name,
        role,
      });

      // 2. Call your local API
      const data = {
        name: form.name,
        email: form.email,
        clerkUserId,
        ...(role === "STUDENT" && { parentPhone: form.parentPhone }),
      };

      if (role === "STUDENT") await createStudent(data);
      else await createTeacher(data);

      close();
      setForm({ name: "", email: "", parentPhone: "" });
    } catch (err) {
      console.error("User creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (openModal !== ("createUser" as typeof openModal)) return null;

  return (
    <Dialog open={true} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Create {role === "STUDENT" ? "Student" : "Teacher"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label className="mb-2">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {role === "STUDENT" && (
            <div>
              <Label className="mb-2">Parent Phone</Label>
              <Input
                value={form.parentPhone}
                onChange={(e) =>
                  setForm({ ...form, parentPhone: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <Label className="mb-2">Role</Label>
            <Select
              value={role}
              onValueChange={(val) => setRole(val as "STUDENT" | "TEACHER")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Creating..." : `Create ${role}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
