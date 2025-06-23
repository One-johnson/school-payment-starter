import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/hooks/axios";
import { Term } from "@/app/types/entities";

type TermPayload = {
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
};

interface TermStore {
  terms: Term[];
  selectedTerm?: Term;
  loading: boolean;
  error: string | null;
  fetchTerms: () => Promise<void>;
  getTermById: (id: string) => Promise<void>;
  createTerm: (data: TermPayload) => Promise<void>;
  updateTerm: (id: string, data: Partial<TermPayload>) => Promise<void>;
  deleteTerm: (id: string) => Promise<void>;
}

export const useTermStore = create(
  persist<TermStore>(
    (set) => ({
      terms: [],
      selectedTerm: undefined,
      loading: false,
      error: null,

      fetchTerms: async () => {
        set({ loading: true, error: null });
        try {
          const res = await api.get("/terms");
          set({ terms: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      getTermById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.get(`/terms?id=${id}`);
          set({ selectedTerm: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      createTerm: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/terms", data);
          set((state) => ({
            terms: [res.data, ...state.terms],
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      updateTerm: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.put("/terms", { id, ...data });
          set((state) => ({
            terms: state.terms.map((t) =>
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

      deleteTerm: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await api.delete("/terms", { data: { id } });
          set((state) => ({
            terms: state.terms.filter((t) => t.id !== id),
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "term-store",
    }
  )
);
