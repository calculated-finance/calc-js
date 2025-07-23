import { create } from "zustand";

type NodeModalStore = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

export const useNodeModalStore = create<NodeModalStore>((set) => ({
  openId: null,
  setOpenId: (id: string | null) => set({ openId: id }),
}));
