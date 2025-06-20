import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Payment } from "@/app/types/entities";
import api from "@/hooks/axios";

interface PaymentStore {
  payments: Payment[];
  selectedPayment?: Payment;
  loading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  getPaymentById: (id: string) => Promise<void>;
  createPayment: (data: Partial<Payment>) => Promise<void>;
  updatePayment: (id: string, data: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

export const usePaymentStore = create(
  persist<PaymentStore>(
    (set) => ({
      payments: [],
      selectedPayment: undefined,
      loading: false,
      error: null,

      fetchPayments: async () => {
        set({ loading: true, error: null });
        try {
          const res = await api.get("/payments");
          set({ payments: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      getPaymentById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.get(`/payments?id=${id}`);
          set({ selectedPayment: res.data });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      createPayment: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/payments", data);
          set((state) => ({
            payments: [res.data, ...state.payments],
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      updatePayment: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.put("/payments", { id, ...data });
          set((state) => ({
            payments: state.payments.map((p) =>
              p.id === id ? { ...p, ...res.data } : p
            ),
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      deletePayment: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await api.delete("/payments", { data: { id } });
          set((state) => ({
            payments: state.payments.filter((p) => p.id !== id),
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
      name: "payment-store",
    }
  )
);
