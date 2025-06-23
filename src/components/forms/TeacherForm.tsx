"use client";

import { useEffect } from "react";
import { useModalStore } from "@/app/store/useModalStore";
import { useTeacherStore } from "@/app/store/useTeacherStore";
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
import { Teacher } from "@/app/types/entities";
import { teacherSchema } from "@/app/validations/Schemas";

export default function TeacherForm() {
  const { openModal, close } = useModalStore();
  const { createTeacher, updateTeacher } = useTeacherStore();
  const { classes, fetchClasses } = useClassStore();

  const isEdit = openModal?.type === "editTeacher";
  const isCreate = openModal?.type === "createTeacher";
  const teacherData: Teacher | undefined =
    openModal?.type === "editTeacher" ? openModal.teacherData : undefined;

  useEffect(() => {
    if (isCreate || isEdit) fetchClasses();
  }, [isCreate, isEdit, fetchClasses]);

  if (!isCreate && !isEdit) return null;

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-md bg-gray-950 p-6">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">
            {isEdit ? "Edit Teacher" : "Create New Teacher"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            name: teacherData?.name ?? "",
            email: teacherData?.email ?? "",
            bio: teacherData?.teacher?.bio ?? "",
            certification: teacherData?.teacher?.certification ?? "",
            yearsOfExperience:
              teacherData?.teacher?.yearsOfExperience?.toString() ?? "",
              classId: teacherData?.teacher?.classId ?? "",
          }}
          validationSchema={teacherSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const clerkUserId = teacherData?.clerkUserId || ""; // Replace with real logic
              const payload = {
                name: values.name,
                email: values.email,
                clerkUserId,
                teacher: {
                  bio: values.bio,
                  certification: values.certification,
                  yearsOfExperience: values.yearsOfExperience
                    ? Number(values.yearsOfExperience)
                    : undefined,
                  classId: values.classId || undefined,
                },
              };
              

              if (isEdit && teacherData) {
                await updateTeacher(teacherData.id, payload);
                toast.success("Teacher updated");
                close();
              } else {
                if (!payload.clerkUserId) {
                  toast.error("clerkUserId is required");
                  setSubmitting(false);
                  return;
                }
                await createTeacher(payload);
                toast.success("Teacher created");
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
                  <Label className="mb-2">Bio</Label>
                  <Input
                    name="bio"
                    type="text"
                    value={values.bio}
                    onChange={handleChange}
                  />
                  {touched.bio && errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio}</p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">Certification</Label>
                  <Input
                    name="certification"
                    type="text"
                    value={values.certification}
                    onChange={handleChange}
                  />
                  {touched.certification && errors.certification && (
                    <p className="text-sm text-red-500">
                      {errors.certification}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Years of Experience</Label>
                  <Input
                    name="yearsOfExperience"
                    type="number"
                    value={values.yearsOfExperience}
                    onChange={handleChange}
                  />
                  {touched.yearsOfExperience && errors.yearsOfExperience && (
                    <p className="text-sm text-red-500">
                      {errors.yearsOfExperience}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-2">Assign Class</Label>
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
                    <SelectContent className="bg-gray-900">
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
