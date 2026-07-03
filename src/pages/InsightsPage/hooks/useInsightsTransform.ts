import type { Transaction } from "@apptypes/transactions";
import { useMemo } from "react";

const formatSpendingByCategory = (transactions: Transaction[]) => {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.amount >= 0) continue;
    totals.set(
      tx.category,
      (totals.get(tx.category) ?? 0) + Math.abs(tx.amount),
    );
  }
  return [...totals.entries()]
    .map(([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100,
    }))
    .sort((a, b) => b.total - a.total);
};

const formatIncomeVsExpense = (transactions: Transaction[]) => {
  const months = new Map<
    string,
    { month: string; income: number; expenses: number }
  >();
  for (const tx of transactions) {
    const month = tx.date.slice(0, 7);
    const entry = months.get(month) ?? { month, income: 0, expenses: 0 };
    if (tx.amount >= 0) entry.income += tx.amount;
    else entry.expenses += Math.abs(tx.amount);
    months.set(month, entry);
  }
  return [...months.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((entry) => ({
      ...entry,
      income: Math.round(entry.income * 100) / 100,
      expenses: Math.round(entry.expenses * 100) / 100,
    }));
};

const formatTopMerchant = (transactions: Transaction[]) => {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.amount >= 0) continue;
    totals.set(
      tx.description,
      (totals.get(tx.description) ?? 0) + Math.abs(tx.amount),
    );
  }
  return [...totals.entries()]
    .map(([merchant, total]) => ({
      merchant,
      total: Math.round(total * 100) / 100,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

export const useInsightsTransform = (transactions: Transaction[]) => {
  const spendingTransactions = useMemo(
    () => (transactions ?? []).filter((tx) => tx.category !== "Transfer"),
    [transactions],
  );

  const spendingByCategory = useMemo(() => {
    return formatSpendingByCategory(spendingTransactions);
  }, [spendingTransactions]);

  const monthlyIncomeVsExpense = useMemo(() => {
    return formatIncomeVsExpense(spendingTransactions)
  }, [spendingTransactions]);

  const spendingTrend = useMemo(
    () =>
      monthlyIncomeVsExpense.map(({ month, expenses }) => ({
        month,
        expenses,
      })),
    [monthlyIncomeVsExpense],
  );

  const topMerchants = useMemo(() => {
    return formatTopMerchant(spendingTransactions)
  }, [spendingTransactions]);

  return {
    spendingByCategory,
    spendingTrend,
    topMerchants,
    monthlyIncomeVsExpense
  }
};
