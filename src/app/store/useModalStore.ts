// store/useModalStore.ts

import { create } from "zustand";

type ModalType = "student" | "teacher" | "class" | "createUser" | null;

interface ModalStore {
  openModal: ModalType;
  open: (type: ModalType) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  open: (type) => set({ openModal: type }),
  close: () => set({ openModal: null }),
}));
