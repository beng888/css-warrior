import { Session } from '@supabase/supabase-js';
import create from 'zustand';
import produce from 'immer';

interface AppState {
  session: Session | null;
  setSession(value: Session | null): void;
  overlays: Overlays;
  openOverlay(data: Omit<Overlay, 'open'>): void;
  closeOverlay(id: string): void;
}

const zIndex = 1200;

const useAppStore = create<AppState>((set) => ({
  session: null,
  setSession: (session: AppState['session']) => set(() => ({ session })),
  overlays: {},
  openOverlay: (data) =>
    set(
      produce((state) => {
        console.log('%c⧭', 'color: #bfffc8', data);
        const existing = state.overlays[data.id];
        console.log('%c⧭', 'color: #997326', { existing });
        if (existing) state.overlays[data.id].open = true;
        if (!existing) state.overlays[data.id] = { ...data, open: true };
      }),
    ),
  closeOverlay: (id) =>
    set(
      produce((state) => {
        const existing = state.overlays[id];
        if (existing) state.overlays[id].open = false;
      }),
    ),
}));

export default useAppStore;
