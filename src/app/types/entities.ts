// roles
export type Role = "ADMIN" | "TEACHER" | "STUDENT";

// base user model
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

// student metadata
export interface StudentEntity {
  parentPhone?: string;
  guardianName?: string;
  healthNotes?: string;
  isRepeating: boolean;
  classId?: string;
  class?: ClassEntity;
  enrolledIn?: ClassEntity[];
}

// full student = user + student info
export interface Student extends BaseUser {
  role: "STUDENT";
  student: StudentEntity;
  payments?: Payment[];
}

// teacher metadata
export interface TeacherEntity {
  bio?: string;
  certification?: string;
  yearsOfExperience?: number;
  teaches?: ClassEntity[];
}

// full teacher = user + teacher info
export interface Teacher extends BaseUser {
  role: "TEACHER";
  teacher: TeacherEntity;
}

// class
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

// payments
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  reference: string;
  trackingId: string;
  user?: BaseUser; // or you can use `Student` if only students can pay
  createdAt: string;
  updatedAt: string;
}
