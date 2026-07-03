import type { Transaction } from "@apptypes/transactions";
import { FinancialDataFacade } from "@utils/formatTransaction";
import { useMemo } from "react";

export const useInsightsTransform = (transactions: Transaction[]) => {
  const spendingTransactions = useMemo(
    () => (transactions ?? []).filter((tx) => tx.category !== "Transfer"),
    [transactions],
  );

  const financialFacade = new FinancialDataFacade(spendingTransactions);

  const {
    spendingByCategory,
    monthlyIncomeVsExpense,
    topMerchants,
    spendingTrend,
  } = financialFacade.getFullReport();

  return {
    spendingByCategory,
    spendingTrend,
    topMerchants,
    monthlyIncomeVsExpense,
  };
};
