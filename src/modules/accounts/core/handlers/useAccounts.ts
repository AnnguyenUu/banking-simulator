import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "@modules/accounts/repository/accounts";
import { ACCOUNT_QUERY_KEY } from "../../configuration/constants";

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
