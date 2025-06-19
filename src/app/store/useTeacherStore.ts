import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Teacher } from "@/app/types/entities";
import api from "@/app/lib/axios";

interface TeacherStore {
  teachers: Teacher[];
  selectedTeacher?: Teacher;
  loading: boolean;
  error: string | null;
  fetchTeachers: () => Promise<void>;
  getTeacherById: (id: string) => Promise<void>;
  createTeacher: (data: Partial<Teacher>) => Promise<void>;
  updateTeacher: (id: string, data: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
}

export const useTeacherStore = create(
  persist<TeacherStore>(
    (set) => ({
      teachers: [],
      selectedTeacher: undefined,
      loading: false,
      error: null,

      fetchTeachers: async () => {
        set({ loading: true, error: null });
        try {
          const res = await api.get("/teachers");
          set({ teachers: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      getTeacherById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.get(`/teachers?id=${id}`);
          set({ selectedTeacher: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      createTeacher: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/teachers", data);
          set((state) => ({
            teachers: [res.data, ...state.teachers],
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      updateTeacher: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.put("/teachers", { id, ...data });
          set((state) => ({
            teachers: state.teachers.map((t) =>
              t.id === id ? { ...t, ...res.data } : t
            ),
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      deleteTeacher: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await api.delete("/teachers", { data: { id } });
          set((state) => ({
            teachers: state.teachers.filter((t) => t.id !== id),
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: "teacher-store" }
  )
);
