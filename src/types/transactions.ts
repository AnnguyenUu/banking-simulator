export type GetTransactionPayload = {
  page: number;
  perPage: number;
} & Partial<{
  accountId: string;
  description: string;
  category: string;
  search: string;
  fromDate: string;
  toDate: string;
}>;

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: "completed" | "pending";
  balanceAfter: number
}
