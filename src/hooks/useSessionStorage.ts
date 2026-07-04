import { useCallback, useState } from "react";

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      try {
        if (value === null || value === undefined) {
          window.sessionStorage.removeItem(key);
        } else {
          window.sessionStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // sessionStorage unavailable (private mode, quota exceeded) —
        // state still works in-memory for the lifetime of this component.
      }
    },
    [key],
  );

  return [storedValue, setValue] as const;
}
