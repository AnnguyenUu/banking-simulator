import type { Account, Transaction } from '@apptypes/banking';

export interface TransactionWithBalance extends Transaction {
  balanceAfter: number;
}

export function withRunningBalance(account: Account, transactions: Transaction[]): TransactionWithBalance[] {
  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  let balance = account.balance;
  return sorted.map((tx) => {
    const balanceAfter = balance;
    balance -= tx.amount;
    return { ...tx, balanceAfter };
  });
}
