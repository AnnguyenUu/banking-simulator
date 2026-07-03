export type AccountStatus = "active" | "frozen" | "closed";

export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit";
  balance: number;
  currency: string;
  accountNumber: string;
  status: AccountStatus;
}

export type GetTransactionPayload = {
  page: number;
  perPage: number;
} & Partial<{
  accountId: string;
  description: string;
  category: string;
  search: string
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

export type Permission =
  | "overview:view"
  | "transactions:view"
  | "transfers:view"
  | "transfers:create"
  | "insights:view";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  theme: "light" | "dark";
  permissions: Permission[];
  menu: MenuItem[];
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
}

export interface TransferResult {
  fromAccount: Account;
  toAccount: Account;
  transactions: [Transaction, Transaction];
}

export interface TransferFormValues {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
}