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
export interface Student extends BaseUser {
  role: "STUDENT";
  parentPhone?: string;
  guardianName?: string;
  healthNotes?: string;
  isRepeating: boolean;
  classId: string;
  class?: ClassEntity;
  payments?: Payment[];
}

// ─── TEACHER ───────────────────────────────────────────
export interface Teacher extends BaseUser {
  role: "TEACHER";
  bio?: string;
  certification?: string;
  yearsOfExperience?: number;
  classId?: string;
  class?: ClassEntity; // direct reference
}

// ─── CLASS ─────────────────────────────────────────────
export interface ClassEntity {
  id: string; // e.g., CLS_XXXX
  name: string;
  trackingId: string;
  teacherId?: string;
  teacher?: Teacher;
  students?: Student[];
  createdAt: string;
}

// ─── TERM ──────────────────────────────────────────────
export interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  academicYear: string;
  payments?: Payment[];
}

// ─── PAYMENT ───────────────────────────────────────────
export interface Payment {
  id: string;
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
