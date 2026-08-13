import { create } from "zustand";

interface NodeModalStore {
  openId: string | number | null;
  setOpenId: (id: string | number | null) => void;
}

export const useNodeModalStore = create<NodeModalStore>((set) => ({
  openId: null,
  setOpenId: (id: string | number | null) => { set({ openId: id }); },
}));
