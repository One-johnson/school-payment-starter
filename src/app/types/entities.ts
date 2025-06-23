// ─── ROLES ─────────────────────────────────────────────
export type Role = "ADMIN" | "TEACHER" | "STUDENT";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

// ─── BASE USER ─────────────────────────────────────────
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  trackingId: string;
  clerkUserId?: string;
  createdAt: string;
}

// ─── STUDENT ───────────────────────────────────────────
export interface StudentEntity {
  parentPhone?: string;
  guardianName?: string;
  healthNotes?: string;
  isRepeating: boolean;
  classId: string;
  class?: ClassEntity;
}

export interface Student extends BaseUser {
  role: "STUDENT";
  student: StudentEntity;
  payments?: Payment[];
}

// ─── TEACHER ───────────────────────────────────────────
export interface TeacherEntity {
  bio?: string;
  certification?: string;
  yearsOfExperience?: number;
  classId?: string; // ← add this
  class?: ClassEntity;
}

export interface Teacher extends BaseUser {
  role: "TEACHER";
  teacher: TeacherEntity;
}

// ─── CLASS ─────────────────────────────────────────────
export interface ClassEntity {
  id: string; // custom ID like CLS_XXXX
  name: string;
  trackingId: string;
  teacherId?: string;
  teacher?: Teacher;
  students?: Student[];
  createdAt: string;
}

// ─── TERM ──────────────────────────────────────────────
export interface Term {
  id: string; // custom ID like TERM_XXXX
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  academicYear: string;
  payments?: Payment[];
  updatedAt: string;


}

// ─── PAYMENT ───────────────────────────────────────────
export interface Payment {
  id: string; // custom ID like PAY_XXXX
  trackingId: string;
  reference: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;

  userId: string;
  user?: BaseUser;

  studentId?: string;
  student?: Student;

  classId?: string;
  class?: ClassEntity;

  termId?: string;
  term?: Term;
}
