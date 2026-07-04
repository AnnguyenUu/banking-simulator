export interface SpendingByCategory {
  category: string;
  total: number;
}

export interface MonthlyIncomeVsExpense {
  month: string;
  income: number;
  expenses: number;
}

export interface TopMerchant {
  merchant: string;
  total: number;
}

export interface Insights {
  spendingByCategory: SpendingByCategory[];
  monthlyIncomeVsExpense: MonthlyIncomeVsExpense[];
  topMerchants: TopMerchant[];
}
