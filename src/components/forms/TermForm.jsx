"use client";

import { useEffect } from "react";
import { useModalStore } from "@/app/store/useModalStore";
import { useTermStore } from "@/app/store/useTermStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Formik, Form } from "formik";
import { Loader2 } from "lucide-react";
import { termSchema } from "@/app/validations/Schemas";
import { toast } from "sonner";
import { Term } from "@/app/types/entities";

export default function TermForm() {
  const { openModal, close } = useModalStore();
  const { createTerm, updateTerm } = useTermStore();

  const isEdit = openModal?.type === "editTerm";
  const isCreate = openModal?.type === "createTerm";
  const termData = isEdit ? openModal.data : undefined;

  if (!isCreate && !isEdit) return null;

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-md bg-gray-950 p-6">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">
            {isEdit ? "Edit Term" : "Create New Term"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            name: termData?.name || "",
            startDate: termData?.startDate || "",
            endDate: termData?.endDate || "",
            academicYear: termData?.academicYear || "",
          }}
          validationSchema={termSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if (isEdit && termData) {
                await updateTerm(termData.id, values);
                toast.success("Term updated");
                close();
              } else {
                await createTerm(values);
                toast.success("Term created");
                resetForm();
              }
            } catch (err) {
              toast.error(err.message || "Something went wrong");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, handleReset, isSubmitting, touched, errors }) => (
            <Form className="space-y-4">
              <div>
                <Label>Term Name</Label>
                <Input name="name" value={values.name} onChange={handleChange} />
                {touched.name && errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input name="startDate" type="date" value={values.startDate} onChange={handleChange} />
                  {touched.startDate && errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input name="endDate" type="date" value={values.endDate} onChange={handleChange} />
                  {touched.endDate && errors.endDate && (
                    <p className="text-sm text-red-500">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Academic Year</Label>
                <Input name="academicYear" value={values.academicYear} onChange={handleChange} />
                {touched.academicYear && errors.academicYear && (
                  <p className="text-sm text-red-500">{errors.academicYear}</p>
                )}
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <Button variant="outline" type="reset" onClick={handleReset} disabled={isSubmitting}>
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </span>
                  ) : isEdit ? (
                    "Update Term"
                  ) : (
                    "Create Term"
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
