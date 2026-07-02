export type AccountStatus = 'active' | 'frozen' | 'closed';

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  currency: string;
  accountNumber: string;
  status: AccountStatus;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'completed' | 'pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
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
