import * as Yup from "yup";

export const classSchema = Yup.object({
  name: Yup.string().required("Class name is required"),
  teacherId: Yup.string().nullable(),
});

export const studentSchema = Yup.object({
  name: Yup.string().required("Student name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  parentPhone: Yup.string()
    .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .nullable(),
  guardianName: Yup.string().nullable(),
  healthNotes: Yup.string().nullable(),
  isRepeating: Yup.boolean().default(false),
  classId: Yup.string().required("Class is required"),
});

export const teacherSchema = Yup.object({
  name: Yup.string().required("Teacher name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  bio: Yup.string().nullable(),
  certification: Yup.string().nullable(),
  yearsOfExperience: Yup.number()
    .min(0, "Experience must be a positive number")
    .nullable(),
});

export const termSchema = Yup.object({
  name: Yup.string().required("Term name is required"),
  academicYear: Yup.string()
    .required("Academic year is required")
    .matches(
      /^\d{4}\/\d{4}$/,
      "Academic year must be in the format YYYY/YYYY (e.g. 2024/2025)"
    ),
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Invalid start date"),
  endDate: Yup.date()
    .required("End date is required")
    .typeError("Invalid end date")
    .min(Yup.ref("startDate"), "End date must be after start date"),
});

export const paymentSchema = Yup.object({
  userId: Yup.string().required("User is required"),
  amount: Yup.number()
    .required("Amount is required")
    .min(0.01, "Amount must be greater than zero"),
  status: Yup.mixed()
    .oneOf(["PENDING", "SUCCESS", "FAILED"])
    .default("PENDING"),

  studentId: Yup.string().nullable(),
  classId: Yup.string().nullable(),
  termId: Yup.string().nullable(),
});
