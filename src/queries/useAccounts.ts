import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "@api/requests/accounts";
import { ACCOUNT_QUERY_KEY } from "@context/query-keys";

export function useAccounts() {
  const query = useQuery({
    queryKey: [ACCOUNT_QUERY_KEY],
    queryFn: fetchAccounts,
  });
  return {
    ...query,
    accounts: query?.data?.data || [],
  };
}
