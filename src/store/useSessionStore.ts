import { create } from 'zustand';
import type { User } from '@apptypes/user';

interface SessionState {
  user: User | null;
  selectedAccountId: string | null;
  setUser: (user: User | null) => void;
  selectAccount: (accountId: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  selectedAccountId: null,
  setUser: (user) => set({ user }),
  selectAccount: (selectedAccountId) => set({ selectedAccountId }),
}));
