import { create } from 'zustand';

interface SessionState {
  selectedAccountId: string | null;
  selectAccount: (accountId: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  selectedAccountId: null,
  selectAccount: (selectedAccountId) => set({ selectedAccountId }),
}));
