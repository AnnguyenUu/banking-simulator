import type { Account, Transaction } from '@apptypes/banking';

export interface TransactionWithBalance extends Transaction {
  balanceAfter: number;
}

/**
 * Reconstructs the balance an account had right after each of its transactions,
 * working backwards from the account's current balance. Transactions must all
 * belong to the same account; any not in `account`'s history will skew the result.
 */
export function withRunningBalance(account: Account, transactions: Transaction[]): TransactionWithBalance[] {
  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  let balance = account.balance;
  return sorted.map((tx) => {
    const balanceAfter = balance;
    balance -= tx.amount;
    return { ...tx, balanceAfter };
  });
}
