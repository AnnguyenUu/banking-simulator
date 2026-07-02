import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@api/banking";
import type { GetTransactionPayload } from "@apptypes/banking";

export function useTransactions(params?: GetTransactionPayload) {
  const query = useQuery({
    queryKey: ["transactions", JSON.stringify(params)],
    queryFn: () => fetchTransactions(params),
  });
  return {
    ...query,
    transactions: query?.data?.data || [],
    total: query?.data?.total
  };
}
