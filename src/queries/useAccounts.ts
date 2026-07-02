import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "@api/banking";

export function useAccounts() {
  const query = useQuery({ queryKey: ["accounts"], queryFn: fetchAccounts });
  return {
    ...query,
    accounts: query?.data?.data || [],
  };
}
