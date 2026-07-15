import { useQuery } from "@tanstack/react-query";
import { fetchInsights } from "@modules/insights/repository/insights";
import { INSIGHTS_QUERY_KEY } from "../../configuration/constants";

export function useInsights() {
  const query = useQuery({
    queryKey: [INSIGHTS_QUERY_KEY],
    queryFn: () => fetchInsights(),
  });

  return {
    ...query,
    spendingByCategory: query.data?.spendingByCategory ?? [],
    monthlyIncomeVsExpense: query.data?.monthlyIncomeVsExpense ?? [],
    topMerchants: query.data?.topMerchants ?? [],
  };
}
