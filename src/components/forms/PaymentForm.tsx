"use client";

import { useEffect } from "react";
import { useModalStore } from "@/app/store/useModalStore";
import { usePaymentStore } from "@/app/store/usePaymentStore";
import { useClassStore } from "@/app/store/useClassStore";
import { useStudentStore } from "@/app/store/useStudentStore";
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
import { paymentSchema } from "@/app/validations/Schemas";
import { Payment } from "@/app/types/entities";



function generateTrackingId() {
  return `PAY_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
}

export default function PaymentForm() {
  const { openModal, close } = useModalStore();
  const { createPayment, updatePayment } = usePaymentStore();
  const { classes, fetchClasses } = useClassStore();
  const { students, fetchStudents } = useStudentStore();
  const { terms, fetchTerms } = useTermStore();

  const isEdit = openModal?.type === "editPayment";
  const isCreate = openModal?.type === "createPayment";
  const paymentData: Payment | undefined =
    openModal?.type === "editPayment" ? openModal.data : undefined;

  useEffect(() => {
    if (isCreate || isEdit) {
      fetchClasses();
      fetchStudents();
      fetchTerms();
    }
  }, [isCreate, isEdit, fetchClasses, fetchStudents, fetchTerms]);

  if (!isCreate && !isEdit) return null;

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-md bg-gray-950 p-6">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">
            {isEdit ? "Edit Payment" : "Create New Payment"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            amount: paymentData?.amount || 0,
            studentId: paymentData?.studentId || "",
            classId: paymentData?.classId || "",
            termId: paymentData?.termId || "",
            status: paymentData?.status || "PENDING",
          }}
          validationSchema={paymentSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const trackingId = generateTrackingId();
              const reference = `REF_${Date.now()}`;

              if (isEdit && paymentData) {
                await updatePayment(paymentData.id, values);
                toast.success("Payment updated");
                close();
              } else {
                await createPayment({
                  ...values,
                  trackingId,
                  reference,
                });
                toast.success("Payment created");
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
          }) => (
            <Form className="space-y-4">
              <div>
                <Label>Amount</Label>
                <Input
                  name="amount"
                  type="number"
                  value={values.amount}
                  onChange={handleChange}
                />
                {touched.amount && errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Student</Label>
                  <Select
                    name="studentId"
                    value={values.studentId}
                    onValueChange={(val) =>
                      handleChange({
                        target: { name: "studentId", value: val },
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900">
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Class</Label>
                  <Select
                    name="classId"
                    value={values.classId}
                    onValueChange={(val) =>
                      handleChange({ target: { name: "classId", value: val } })
                    }
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Term</Label>
                  <Select
                    name="termId"
                    value={values.termId}
                    onValueChange={(val) =>
                      handleChange({ target: { name: "termId", value: val } })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900">
                      {terms.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    name="status"
                    value={values.status}
                    onValueChange={(val) =>
                      handleChange({ target: { name: "status", value: val } })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900">
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SUCCESS">Success</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button type="submit" disabled={isSubmitting}>
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
