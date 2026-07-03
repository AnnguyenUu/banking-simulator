import type { Account } from "./accounts";
import type { Transaction } from "./transactions";

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
