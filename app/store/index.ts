import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  count: number;
};

type Actions = {
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
};

export const useBearStore = create<Actions & State>()(
  persist(
    immer((set) => ({
      count: 0,
      increment: (qty) => set((state) => ({ count: state.count + qty })),
      decrement: (qty) => set((state) => ({ count: state.count - qty })),
    })),
    {
      name: "notes-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
