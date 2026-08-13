import { create } from "zustand";

interface NodeVisibilityStore {
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
}

export const useNodeVisibilityStore = create<NodeVisibilityStore>((set) => ({
  isVisible: true,
  setVisible: (isVisible: boolean) => { set({ isVisible }); },
}));
