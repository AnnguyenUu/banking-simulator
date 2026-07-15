import { useSessionStorage } from "@hooks/useSessionStorage";

const SELECTED_ACCOUNT_STORAGE_KEY = "selectedAccountId";

export function useSelectedAccount() {
  return useSessionStorage<string | null>(SELECTED_ACCOUNT_STORAGE_KEY, null);
}
