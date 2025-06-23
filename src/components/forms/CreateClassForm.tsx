"use client";

import { useEffect } from "react";
import { useModalStore } from "@/app/store/useModalStore";
import { useClassStore } from "@/app/store/useClassStore";
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
import { Formik, Form } from "formik";
import { toast } from "sonner";
import { classSchema } from "@/app/validations/Schemas";
import { ClassEntity } from "@/app/types/entities";
import { Loader2 } from "lucide-react";

export default function CreateClassForm() {
  const { openModal, close } = useModalStore();
  const { createClass, updateClass } = useClassStore();
  const { teachers, fetchTeachers } = useTeacherStore();

  const isEdit = openModal?.type === "editClass";
  const isCreate = openModal?.type === "createClass";
  const classData: ClassEntity | undefined =
    openModal?.type === "editClass" ? openModal.data : undefined;

  useEffect(() => {
    if (isCreate || isEdit) fetchTeachers();
  }, [isCreate, isEdit, fetchTeachers]);

  const isFormOpen = isCreate || isEdit;
  if (!isFormOpen) return null;

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-md bg-gray-950 p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            {isEdit ? "Edit Class" : "Create New Class"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            name: classData?.name || "",
            teacherId: classData?.teacherId || "",
          }}
          validationSchema={classSchema}
          enableReinitialize
          onSubmit={async (
            values: { name: string; teacherId: string },
            { setSubmitting, resetForm }
          ) => {
            try {
              if (isEdit && classData) {
                await updateClass(classData.id, values);
                toast.success("Class updated successfully!");
                close(); // Only close on edit
              } else {
                await createClass(values);
                toast.success("Class created successfully!");
                resetForm(); // Stay open and reset on create
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
              toast.error(err.message || "Something went wrong");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            handleChange,
            handleReset,
            isSubmitting,
            errors,
            touched,
          }) => (
            <Form className="space-y-4">
              <div>
                <Label className="mb-2">Class Name</Label>
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  autoFocus
                  placeholder="Enter class name"
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <Label className="mb-2">Assign Teacher</Label>
                <Select
                  name="teacherId"
                  value={values.teacherId}
                  onValueChange={(val) =>
                    handleChange({
                      target: { name: "teacherId", value: val },
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-950">
                    {teachers.length === 0 ? (
                      <SelectItem disabled value="All">
                        Loading teachers...
                      </SelectItem>
                    ) : (
                      teachers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {touched.teacherId && errors.teacherId && (
                  <p className="text-sm text-red-500">{errors.teacherId}</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <Button variant="ghost" onClick={close} type="button">
                  Cancel
                </Button>
                <Button
                  type="reset"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>

                <Button variant="default" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </span>
                  ) : isEdit ? (
                    "Update Class"
                  ) : (
                    "Create Class"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
