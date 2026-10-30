import { create } from "zustand";
type PlayerState = { isPlaying: boolean; toggle: () => void; stop: () => void };
export const usePlayerStore = create<PlayerState>((set) => ({ isPlaying: false, toggle: () => set((state) => ({ isPlaying: !state.isPlaying })), stop: () => set({ isPlaying: false }) }));
