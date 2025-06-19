// store/useFilterStore.ts

import { create } from "zustand";

interface FilterState {
  search: string;
  setSearch: (value: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
  reset: () => set({ search: "" }),
}));
