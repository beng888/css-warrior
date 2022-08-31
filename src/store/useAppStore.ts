import { Session } from '@supabase/supabase-js';
import create from 'zustand';

interface AppState {
  session: Session | null;
  setSession(value: Session | null): void;
  styleSheetOpen: boolean;
  setStyleSheetOpen(val: boolean): void;

  // activeDivId: string | null;
  // setActiveDivId(value: string | null): void;
  // activeDivIds: string[];
  // setActiveDivIds(value: string[]): void;
  // isStyleSheetOpen: boolean;
  // openStyleSheet(): void;
  // closeStyleSheet(): void;
  // test(): void;
}

const useAppStore = create<AppState>((set) => ({
  session: null,
  setSession: (session: AppState['session']) => set(() => ({ session })),
  activeDivId: null,
  styleSheetOpen: false,
  setStyleSheetOpen: (val) => set(() => ({ styleSheetOpen: val })),

  // setActiveDivId: (value) => set(() => ({ activeDivId: value })),
  // activeDivIds: [],
  // setActiveDivIds: (value) => set(() => ({ activeDivIds: value })),

  // isStyleSheetOpen: false,
  // openStyleSheet: () => set(() => ({ isStyleSheetOpen: true })),
  // closeStyleSheet: () => set(() => ({ isStyleSheetOpen: false })),
}));

export default useAppStore;
