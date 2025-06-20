import * as Yup from "yup";

export const classSchema = Yup.object({
  name: Yup.string().required("Class name is required"),
  teacherId: Yup.string().nullable(),
});
