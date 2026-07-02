import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './client';
import type { Account, Transaction, TransferRequest, TransferResult, User } from '@apptypes/banking';
import { withRunningBalance } from '@utils/runningBalance';

type TransactionSeed = Omit<Transaction, 'accountName' | 'balanceAfter'>;

const user: User = {
  id: 'u1',
  name: 'Jordan Lee',
  email: 'jordan.lee@example.com',
};

const accounts: Account[] = [
  { id: 'acc-11', name: 'Everyday Checking', type: 'checking', balance: 4231.55, currency: 'USD', accountNumber: '**** 4821', status: 'active' },
  { id: 'acc-21', name: 'High-Yield Savings', type: 'savings', balance: 18342.1, currency: 'USD', accountNumber: '**** 7734', status: 'active' },
  { id: 'acc-31', name: 'Rewards Credit Card', type: 'credit', balance: -812.4, currency: 'USD', accountNumber: '**** 1190', status: 'frozen' },
];

let transactionSeeds: TransactionSeed[] = [
  // April
  { id: 'tx-101', accountId: 'acc-11', date: '2026-04-01', description: 'Payroll Deposit', category: 'Income', amount: 3200, status: 'completed' },
  { id: 'tx-102', accountId: 'acc-11', date: '2026-04-02', description: 'Rent Payment', category: 'Housing', amount: -1800, status: 'completed' },
  { id: 'tx-103', accountId: 'acc-11', date: '2026-04-04', description: 'Whole Foods Market', category: 'Groceries', amount: -92.15, status: 'completed' },
  { id: 'tx-104', accountId: 'acc-31', date: '2026-04-06', description: 'Amazon.com', category: 'Shopping', amount: -64.2, status: 'completed' },
  { id: 'tx-105', accountId: 'acc-11', date: '2026-04-08', description: 'Shell Gas Station', category: 'Transport', amount: -48.3, status: 'completed' },
  { id: 'tx-106', accountId: 'acc-31', date: '2026-04-10', description: 'Netflix', category: 'Entertainment', amount: -15.49, status: 'completed' },
  { id: 'tx-107', accountId: 'acc-11', date: '2026-04-12', description: 'Trader Joe’s', category: 'Groceries', amount: -58.4, status: 'completed' },
  { id: 'tx-108', accountId: 'acc-31', date: '2026-04-14', description: 'Starbucks', category: 'Dining', amount: -6.75, status: 'completed' },
  { id: 'tx-109', accountId: 'acc-11', date: '2026-04-16', description: 'Electric Company', category: 'Utilities', amount: -88.6, status: 'completed' },
  { id: 'tx-110', accountId: 'acc-21', date: '2026-04-20', description: 'Interest Payment', category: 'Interest', amount: 22.4, status: 'completed' },
  { id: 'tx-111', accountId: 'acc-31', date: '2026-04-22', description: 'Chipotle', category: 'Dining', amount: -14.3, status: 'completed' },
  { id: 'tx-112', accountId: 'acc-11', date: '2026-04-27', description: 'Gym Membership', category: 'Health', amount: -42.0, status: 'completed' },

  // May
  { id: 'tx-201', accountId: 'acc-11', date: '2026-05-01', description: 'Payroll Deposit', category: 'Income', amount: 3200, status: 'completed' },
  { id: 'tx-202', accountId: 'acc-11', date: '2026-05-02', description: 'Rent Payment', category: 'Housing', amount: -1800, status: 'completed' },
  { id: 'tx-203', accountId: 'acc-11', date: '2026-05-05', description: 'Whole Foods Market', category: 'Groceries', amount: -104.8, status: 'completed' },
  { id: 'tx-204', accountId: 'acc-31', date: '2026-05-07', description: 'Best Buy', category: 'Shopping', amount: -229.99, status: 'completed' },
  { id: 'tx-205', accountId: 'acc-11', date: '2026-05-09', description: 'Uber', category: 'Transport', amount: -22.15, status: 'completed' },
  { id: 'tx-206', accountId: 'acc-31', date: '2026-05-11', description: 'Spotify', category: 'Entertainment', amount: -11.99, status: 'completed' },
  { id: 'tx-207', accountId: 'acc-11', date: '2026-05-13', description: 'Safeway', category: 'Groceries', amount: -71.25, status: 'completed' },
  { id: 'tx-208', accountId: 'acc-31', date: '2026-05-15', description: 'Chipotle', category: 'Dining', amount: -16.4, status: 'completed' },
  { id: 'tx-209', accountId: 'acc-11', date: '2026-05-18', description: 'Water Utility', category: 'Utilities', amount: -34.2, status: 'completed' },
  { id: 'tx-210', accountId: 'acc-21', date: '2026-05-20', description: 'Interest Payment', category: 'Interest', amount: 23.1, status: 'completed' },
  { id: 'tx-211', accountId: 'acc-31', date: '2026-05-24', description: 'Amazon.com', category: 'Shopping', amount: -38.5, status: 'completed' },
  { id: 'tx-212', accountId: 'acc-11', date: '2026-05-29', description: 'Movie Theater', category: 'Entertainment', amount: -27.0, status: 'completed' },

  // June
  { id: 'tx-1', accountId: 'acc-11', date: '2026-06-28', description: 'Whole Foods Market', category: 'Groceries', amount: -86.42, status: 'completed' },
  { id: 'tx-2', accountId: 'acc-11', date: '2026-06-27', description: 'Payroll Deposit', category: 'Income', amount: 3200, status: 'completed' },
  { id: 'tx-301', accountId: 'acc-11', date: '2026-06-02', description: 'Rent Payment', category: 'Housing', amount: -1800, status: 'completed' },
  { id: 'tx-3', accountId: 'acc-21', date: '2026-06-25', description: 'Interest Payment', category: 'Interest', amount: 24.18, status: 'completed' },
  { id: 'tx-4', accountId: 'acc-31', date: '2026-06-24', description: 'Amazon.com', category: 'Shopping', amount: -142.99, status: 'completed' },
  { id: 'tx-5', accountId: 'acc-11', date: '2026-06-22', description: 'Electric Company', category: 'Utilities', amount: -95.11, status: 'pending' },
  { id: 'tx-6', accountId: 'acc-31', date: '2026-06-20', description: 'Uber', category: 'Transport', amount: -18.75, status: 'completed' },
  { id: 'tx-302', accountId: 'acc-11', date: '2026-06-18', description: 'Trader Joe’s', category: 'Groceries', amount: -63.1, status: 'completed' },
  { id: 'tx-303', accountId: 'acc-31', date: '2026-06-15', description: 'Netflix', category: 'Entertainment', amount: -15.49, status: 'completed' },
  { id: 'tx-304', accountId: 'acc-11', date: '2026-06-11', description: 'Starbucks', category: 'Dining', amount: -8.25, status: 'completed' },
  { id: 'tx-305', accountId: 'acc-31', date: '2026-06-09', description: 'Chipotle', category: 'Dining', amount: -19.6, status: 'completed' },
  { id: 'tx-306', accountId: 'acc-11', date: '2026-06-06', description: 'Gym Membership', category: 'Health', amount: -42.0, status: 'completed' },
  { id: 'tx-307', accountId: 'acc-11', date: '2026-06-30', description: 'Pharmacy', category: 'Health', amount: -23.4, status: 'pending' },
];

let nextTransferId = 1;

function findAccount(id: string): Account | undefined {
  return accounts.find((account) => account.id === id);
}

// Balances are derived per account from the full seed history (never a filtered/paginated
// slice) so balanceAfter stays correct regardless of what page or search query asked for it.
function hydrateTransactions(seeds: TransactionSeed[]): Transaction[] {
  return accounts.flatMap((account) => {
    const accountSeeds = seeds.filter((tx) => tx.accountId === account.id);
    return withRunningBalance(account, accountSeeds).map((tx) => ({
      ...tx,
      accountName: account.name,
    }));
  });
}

export function installMockBackend() {
  const mock = new MockAdapter(apiClient, { delayResponse: 300 });

  mock.onGet('/me').reply(200, user);

  mock.onGet('/accounts').reply(() => [
    200,
    { data: accounts, page: 1, perPage: accounts.length, total: accounts.length, totalPages: 1 },
  ]);

  mock.onGet(/\/transactions/).reply((config) => {
    const { accountId, search, page, perPage } = config.params ?? {};

    let filtered = hydrateTransactions(transactionSeeds);
    if (accountId) {
      filtered = filtered.filter((t) => t.accountId === accountId);
    }
    if (search) {
      const query = String(search).toLowerCase();
      filtered = filtered.filter(
        (t) => t.description.toLowerCase().includes(query) || t.category.toLowerCase().includes(query),
      );
    }
    filtered = filtered.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1));

    const total = filtered.length;

    // Pagination is opt-in: callers that don't pass page/perPage (e.g. InsightsPage, which
    // needs the complete dataset to build charts) get everything back, unpaginated.
    if (!page || !perPage) {
      return [200, { data: filtered, page: 1, perPage: total, total, totalPages: 1 }];
    }

    const pageNum = Number(page);
    const perPageNum = Number(perPage);
    const start = (pageNum - 1) * perPageNum;
    const data = filtered.slice(start, start + perPageNum);
    const totalPages = Math.max(1, Math.ceil(total / perPageNum));

    return [200, { data, page: pageNum, perPage: perPageNum, total, totalPages }];
  });

  mock.onPost('/transfers').reply((config) => {
    const body = JSON.parse(config.data) as TransferRequest;
    const { fromAccountId, toAccountId, amount, note } = body;

    if (fromAccountId === toAccountId) {
      return [400, { message: 'Source and destination accounts must be different.' }];
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return [400, { message: 'Transfer amount must be greater than zero.' }];
    }

    const fromAccount = findAccount(fromAccountId);
    const toAccount = findAccount(toAccountId);
    if (!fromAccount || !toAccount) {
      return [400, { message: 'One or more accounts could not be found.' }];
    }
    if (fromAccount.status !== 'active' || toAccount.status !== 'active') {
      return [400, { message: 'Both accounts must be active to transfer funds.' }];
    }
    if (fromAccount.balance < amount) {
      return [400, { message: `Insufficient funds in ${fromAccount.name}.` }];
    }

    fromAccount.balance = Math.round((fromAccount.balance - amount) * 100) / 100;
    toAccount.balance = Math.round((toAccount.balance + amount) * 100) / 100;

    const date = new Date().toISOString().slice(0, 10);
    const debit: TransactionSeed = {
      id: `tx-transfer-${nextTransferId++}`,
      accountId: fromAccount.id,
      date,
      description: `Transfer to ${toAccount.name}${note ? ` — ${note}` : ''}`,
      category: 'Transfer',
      amount: -amount,
      status: 'completed',
    };
    const credit: TransactionSeed = {
      id: `tx-transfer-${nextTransferId++}`,
      accountId: toAccount.id,
      date,
      description: `Transfer from ${fromAccount.name}${note ? ` — ${note}` : ''}`,
      category: 'Transfer',
      amount,
      status: 'completed',
    };
    transactionSeeds = [...transactionSeeds, debit, credit];

    const hydrated = hydrateTransactions(transactionSeeds);
    const hydratedDebit = hydrated.find((t) => t.id === debit.id)!;
    const hydratedCredit = hydrated.find((t) => t.id === credit.id)!;

    const result: TransferResult = { fromAccount, toAccount, transactions: [hydratedDebit, hydratedCredit] };
    return [200, result];
  });

  return mock;
}
