// types/entities.ts

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  trackingId: string;
  clerkUserId?: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ STUDENT
export interface Student extends BaseUser {
  role: "STUDENT";
  parentPhone?: string;
  classId?: string;
  class?: ClassEntity;
  payments?: Payment[];
}

// ✅ TEACHER
export interface Teacher extends BaseUser {
  role: "TEACHER";
  classId?: string;
  class?: ClassEntity;
}

// ✅ CLASS
export interface ClassEntity {
  id: string;
  name: string;
  trackingId: string;
  teacherId?: string;
  teacher?: Teacher;
  students?: Student[];
  createdAt: string;
  updatedAt: string;
}

// ✅ PAYMENT
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
  trackingId: string;
  user?: Student;
  createdAt: string;
  updatedAt: string;
}
