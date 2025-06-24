import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Student } from "@/app/types/entities";
import api from "@/hooks/axios";

type StudentPayload = {
  name: string;
  email: string;

  parentPhone?: string;
  guardianName?: string;
  healthNotes?: string;
  isRepeating?: boolean;
  classId: string; // now required
};

interface StudentStore {
  students: Student[];
  selectedStudent?: Student;
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  getStudentById: (id: string) => Promise<void>;
  createStudent: (data: StudentPayload) => Promise<void>;
  updateStudent: (id: string, data: Partial<StudentPayload>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}

export const useStudentStore = create(
  persist<StudentStore>(
    (set, get) => ({
      students: [],
      selectedStudent: undefined,
      loading: false,
      error: null,

      fetchStudents: async () => {
        set({ loading: true, error: null });
        try {
          const res = await api.get("/students");
          set({ students: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.response?.data?.error || err.message });
        } finally {
          set({ loading: false });
        }
      },

      getStudentById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.get(`/students?id=${id}`);
          set({ selectedStudent: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.response?.data?.error || err.message });
        } finally {
          set({ loading: false });
        }
      },

      createStudent: async (data) => {
        set({ loading: true, error: null });
        try {
          await api.post("/students", data);
          await get().fetchStudents();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.response?.data?.error || err.message });
        } finally {
          set({ loading: false });
        }
      },

      updateStudent: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.put("/students", { id, ...data });
          set((state) => ({
            students: state.students.map((s) =>
              s.id === id
                ? {
                    ...s,
                    ...res.data,
                  }
                : s
            ),
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.response?.data?.error || err.message });
        } finally {
          set({ loading: false });
        }
      },

      deleteStudent: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await api.delete("/students", { data: { id } });
          set((state) => ({
            students: state.students.filter((s) => s.id !== id),
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.response?.data?.error || err.message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "student-store",
    }
  )
);
