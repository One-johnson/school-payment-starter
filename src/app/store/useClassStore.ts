import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClassEntity } from "@/app/types/entities";
import api from "@/app/lib/axios";

interface ClassStore {
  classes: ClassEntity[];
  selectedClass?: ClassEntity;
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  getClassById: (id: string) => Promise<void>;
  createClass: (data: Partial<ClassEntity>) => Promise<void>;
  updateClass: (id: string, data: Partial<ClassEntity>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
}

export const useClassStore = create(
  persist<ClassStore>(
    (set) => ({
      classes: [],
      selectedClass: undefined,
      loading: false,
      error: null,

      fetchClasses: async () => {
        set({ loading: true, error: null });
        try {
          const res = await api.get("/classes");
          set({ classes: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      getClassById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.get(`/classes?id=${id}`);
          set({ selectedClass: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      createClass: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/classes", data);
          set((state) => ({
            classes: [res.data, ...state.classes],
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      updateClass: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.put("/classes", { id, ...data });
          set((state) => ({
            classes: state.classes.map((c) =>
              c.id === id ? { ...c, ...res.data } : c
            ),
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      deleteClass: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await api.delete("/classes", { data: { id } });
          set((state) => ({
            classes: state.classes.filter((c) => c.id !== id),
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: "class-store" }
  )
);
