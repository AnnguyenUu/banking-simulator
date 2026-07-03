import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@api/banking";
import type { GetTransactionPayload } from "@apptypes/banking";
import { TRANSACTIONS_KEYS } from "@context/query-keys";

export function useTransactions(params?: GetTransactionPayload) {
  const query = useQuery({
    queryKey: [TRANSACTIONS_KEYS, JSON.stringify(params)],
    queryFn: () => fetchTransactions(params),
  });
  return {
    ...query,
    transactions: query?.data?.data || [],
    total: query?.data?.total
  };
}
