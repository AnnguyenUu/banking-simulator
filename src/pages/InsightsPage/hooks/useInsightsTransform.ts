import type { Transaction } from "@apptypes/transactions";
import { FinancialDataFacade } from "@utils/formatTransaction";
import { useMemo } from "react";

const TRANSFER_STATUS = "Transfer";

const getSpecificTransactions = (transaction: Transaction) =>
  transaction.category !== TRANSFER_STATUS;

export const useInsightsTransform = (transactions: Transaction[]) => {
  const spendingTransactions = useMemo(
    () => (transactions ?? []).filter(getSpecificTransactions),
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
