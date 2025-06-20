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
  isRepeating: Yup.boolean(),
  classId: Yup.string().nullable(),
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
  classId: Yup.string().nullable(),
});
