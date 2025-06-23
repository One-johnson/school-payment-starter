"use client";

import { useEffect } from "react";
import { useModalStore } from "@/app/store/useModalStore";
import { useStudentStore } from "@/app/store/useStudentStore";
import { useClassStore } from "@/app/store/useClassStore";
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
import { Loader2 } from "lucide-react";
import { studentSchema } from "@/app/validations/Schemas";
import { Student } from "@/app/types/entities";

export default function StudentForm() {
  const { openModal, close } = useModalStore();
  const { createStudent, updateStudent } = useStudentStore();
  const { classes, fetchClasses } = useClassStore();

  const isEdit = openModal?.type === "editStudent";
  const isCreate = openModal?.type === "createStudent";
  const studentData: Student | undefined =
    openModal?.type === "editStudent" ? openModal.data : undefined;

  useEffect(() => {
    if (isEdit || isCreate) fetchClasses();
  }, [isEdit, isCreate, fetchClasses]);

  if (!isEdit && !isCreate) return null;

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-md bg-gray-950 p-6">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">
            {isEdit ? "Edit Student" : "Create New Student"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            name: studentData?.name ?? "",
            email: studentData?.email ?? "",
            parentPhone: studentData?.student?.parentPhone ?? "",
            guardianName: studentData?.student?.guardianName ?? "",
            healthNotes: studentData?.student?.healthNotes ?? "",
            isRepeating: studentData?.student?.isRepeating ?? false,
            classId: studentData?.student?.classId ?? "",
          }}
          validationSchema={studentSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if (isEdit && studentData) {
                await updateStudent(studentData.id, {
                  name: values.name,
                  email: values.email,
                  parentPhone: values.parentPhone,
                  guardianName: values.guardianName,
                  healthNotes: values.healthNotes,
                  isRepeating: values.isRepeating,
                  classId: values.classId,
                });
                toast.success("Student updated");
                close();
              } else {
                await createStudent({
                  name: values.name,
                  email: values.email,
                  clerkUserId: "YOUR_CLERK_USER_ID",
                  parentPhone: values.parentPhone,
                  guardianName: values.guardianName,
                  healthNotes: values.healthNotes,
                  isRepeating: values.isRepeating,
                  classId: values.classId,
                });
                toast.success("Student created");
                resetForm();
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
            isSubmitting,
            touched,
            errors,
            handleReset,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Name</Label>
                  <Input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  {touched.name && errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {touched.email && errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Parent Phone</Label>
                  <Input
                    name="parentPhone"
                    value={values.parentPhone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label className="mb-2">Guardian Name</Label>
                  <Input
                    name="guardianName"
                    value={values.guardianName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2">Health Notes</Label>
                <Input
                  name="healthNotes"
                  value={values.healthNotes}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Is Repeating?</Label>
                  <Select
                    value={values.isRepeating ? "yes" : "no"}
                    onValueChange={(val) => {
                      setFieldValue("isRepeating", val === "yes");
                      setFieldTouched("isRepeating", true);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-950">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">Class</Label>
                  <Select
                    value={values.classId}
                    onValueChange={(val) => {
                      setFieldValue("classId", val);
                      setFieldTouched("classId", true);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-950">
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touched.classId && errors.classId && (
                    <p className="text-sm text-red-500">{errors.classId}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 pt-2">
                <Button
                  type="reset"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button variant="outline" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </span>
                  ) : isEdit ? (
                    "Update"
                  ) : (
                    "Create"
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
