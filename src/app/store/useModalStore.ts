// store/useModalStore.ts

import { create } from "zustand";
import { ClassEntity } from "@/app/types/entities"; // Update path if needed

type ModalType =
  | { type: "createUser" }
  | { type: "createClass" }
  | { type: "editClass"; data: ClassEntity }
  | null;

interface ModalStore {
  openModal: ModalType;
  open: (modal: ModalType) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  open: (modal) => set({ openModal: modal }),
  close: () => set({ openModal: null }),
}));
