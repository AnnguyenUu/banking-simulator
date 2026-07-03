import type { Account } from '@apptypes/accounts';

interface DatedTransaction {
  id: string;
  date: string;
  amount: number;
}

export function withRunningBalance<T extends DatedTransaction>(
  account: Account,
  transactions: T[],
): (T & { balanceAfter: number })[] {
  const sorted = [...transactions].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : a.id > b.id ? -1 : 0,
  );
  let balance = account.balance;
  return sorted.map((tx) => {
    const balanceAfter = balance;
    balance -= tx.amount;
    return { ...tx, balanceAfter };
  });
}
