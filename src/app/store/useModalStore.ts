// store/useModalStore.ts

import { create } from "zustand";
import { ClassEntity, Teacher, Student } from "@/app/types/entities";

type ModalType =
  | { type: "createUser" }
  | { type: "createClass" }
  | { type: "editClass"; data: ClassEntity }
  | { type: "createTeacher" }
  | { type: "editTeacher"; teacherData: Teacher }
  | { type: "createStudent" }
  | { type: "editStudent"; data: Student }
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
