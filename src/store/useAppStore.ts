import { Session } from '@supabase/supabase-js';
import create from 'zustand';

interface AppState {
  session: Session | null;
  setSession(value: Session | null): void;
}

const useAppStore = create<AppState>((set) => ({
  session: null,
  setSession: (session: AppState['session']) => set(() => ({ session })),
}));

export default useAppStore;
