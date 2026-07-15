import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "@modules/transactions/repository/transactions";
import type { GetTransactionPayload } from "@apptypes/transactions";
import { TRANSACTIONS_KEYS } from "../../configuration/constants";

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
