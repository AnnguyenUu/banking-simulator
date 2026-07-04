import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../http/client';
import type { Account } from '@apptypes/accounts';
import type { User } from '@apptypes/user';
import type { GetTransactionPayload, Transaction } from '@apptypes/transactions';
import type { TransferRequest } from '@apptypes/transfers';
import type { LoginRequest } from '@apptypes/auth';

const user: User = {
  id: 'u1',
  name: 'Jordan Lee',
  email: 'jordan.lee@example.com',
  theme: 'light',
  permissions: [
    'overview:view',
    'transactions:view',
    'transfers:view',
    'transfers:create',
    'insights:view',
  ],
  menu: [
    { id: 'overview', label: 'Overview', path: '/', icon: 'DashboardOutlined' },
    { id: 'transactions', label: 'Transactions', path: '/transactions', icon: 'SwapOutlined' },
    { id: 'transfer', label: 'Transfer', path: '/transfer', icon: 'SendOutlined' },
    { id: 'insights', label: 'Insights', path: '/insights', icon: 'PieChartOutlined' },
  ],
};

const accounts: Account[] = [
  { id: 'acc-11', name: 'Everyday Checking', type: 'checking', balance: 4231.55, currency: 'USD', accountNumber: '**** 4821', status: 'active' },
  { id: 'acc-21', name: 'High-Yield Savings', type: 'savings', balance: 18342.1, currency: 'USD', accountNumber: '**** 7734', status: 'active' },
  { id: 'acc-31', name: 'Rewards Credit Card', type: 'credit', balance: -812.4, currency: 'USD', accountNumber: '**** 1190', status: 'frozen' },
  { id: 'acc-41', name: 'Legacy Checking', type: 'checking', balance: 128.4, currency: 'USD', accountNumber: '**** 2205', status: 'closed' },
];

const transactions: Transaction[] = [
  { id: 'tx-1', accountId: 'acc-11', accountName: 'Everyday Checking', date: '2026-07-01', description: 'Whole Foods Market', category: 'Groceries', amount: -86.42, status: 'completed', balanceAfter: 4231.55 },
  { id: 'tx-2', accountId: 'acc-11', accountName: 'Everyday Checking', date: '2026-06-15', description: 'Salary Payment', category: 'Income', amount: 3200, status: 'completed', balanceAfter: 4317.97 },
  { id: 'tx-3', accountId: 'acc-21', accountName: 'High-Yield Savings', date: '2026-06-20', description: 'Interest Payment', category: 'Income', amount: 42.1, status: 'completed', balanceAfter: 18342.1 },
  { id: 'tx-4', accountId: 'acc-31', accountName: 'Rewards Credit Card', date: '2026-06-10', description: 'Amazon Purchase', category: 'Shopping', amount: -120, status: 'pending', balanceAfter: -812.4 },
  { id: 'tx-5', accountId: 'acc-11', accountName: 'Everyday Checking', date: '2026-05-28', description: 'Electric Bill', category: 'Utilities', amount: -75.2, status: 'completed', balanceAfter: 1192.97 },
];

const insights = {
  spendingByCategory: [
    { category: 'Groceries', total: 86.42 },
    { category: 'Shopping', total: 120 },
    { category: 'Utilities', total: 75.2 },
  ],
  monthlyIncomeVsExpense: [
    { month: '2026-05', income: 0, expenses: 75.2 },
    { month: '2026-06', income: 3242.1, expenses: 120 },
    { month: '2026-07', income: 0, expenses: 86.42 },
  ],
  topMerchants: [
    { merchant: 'Amazon Purchase', total: 120 },
    { merchant: 'Whole Foods Market', total: 86.42 },
    { merchant: 'Electric Bill', total: 75.2 },
  ],
};

export function installMockBackend() {
  const mock = new MockAdapter(apiClient, { delayResponse: 300 });

  mock.onGet('/me').reply(200, user);

  mock.onGet('/accounts').reply(() => [
    200,
    { data: accounts, page: 1, perPage: accounts.length, total: accounts.length, totalPages: 1 },
  ]);

  mock.onGet('/transactions').reply((config) => {
    const params = (config.params ?? {}) as GetTransactionPayload;
    const { page = 1, perPage = 20, accountId, search, fromDate, toDate } = params;

    let filtered = transactions;

    if (accountId) {
      filtered = filtered.filter((tx) => tx.accountId === accountId);
    }
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(query) ||
          tx.category.toLowerCase().includes(query),
      );
    }
    if (fromDate) {
      filtered = filtered.filter((tx) => tx.date >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter((tx) => tx.date <= toDate);
    }

    const total = filtered.length;
    const start = (page - 1) * perPage;
    const data = filtered.slice(start, start + perPage);

    return [200, { data, page, perPage, total, totalPages: Math.ceil(total / perPage) || 1 }];
  });

  mock.onPost('/transfers').reply((config) => {
    const body = JSON.parse(config.data as string) as TransferRequest;
    const { fromAccountId, toAccountId, amount, note } = body;

    if (!toAccountId || typeof toAccountId !== 'string') {
      return [400, { message: ['toAccountId must be a string'], error: 'Bad Request', statusCode: 400 }];
    }
    if (fromAccountId === toAccountId) {
      return [400, { message: 'Source and destination accounts must differ' }];
    }

    const fromAccount = accounts.find((account) => account.id === fromAccountId);
    const toAccount = accounts.find((account) => account.id === toAccountId);

    if (!fromAccount || !toAccount) {
      return [400, { message: 'Unknown account' }];
    }
    if (fromAccount.status !== 'active' || toAccount.status !== 'active') {
      return [400, { message: 'Both accounts must be active' }];
    }
    if (!amount || amount <= 0) {
      return [400, { message: 'Amount must be greater than zero' }];
    }
    if (fromAccount.balance < amount) {
      return [400, { message: 'Insufficient balance' }];
    }

    fromAccount.balance = Math.round((fromAccount.balance - amount) * 100) / 100;
    toAccount.balance = Math.round((toAccount.balance + amount) * 100) / 100;

    const today = new Date().toISOString().slice(0, 10);
    const debit: Transaction = {
      id: `tx-transfer-${transactions.length + 1}`,
      accountId: fromAccountId,
      accountName: fromAccount.name,
      date: today,
      description: note || `Transfer to ${toAccount.name}`,
      category: 'Transfer',
      amount: -amount,
      status: 'completed',
      balanceAfter: fromAccount.balance,
    };
    const credit: Transaction = {
      id: `tx-transfer-${transactions.length + 2}`,
      accountId: toAccountId,
      accountName: toAccount.name,
      date: today,
      description: note || `Transfer from ${fromAccount.name}`,
      category: 'Transfer',
      amount,
      status: 'completed',
      balanceAfter: toAccount.balance,
    };
    transactions.unshift(debit, credit);

    return [200, { fromAccount, toAccount, transactions: [debit, credit] }];
  });

  mock.onGet('/insights').reply(200, insights);

  mock.onPost('/auth/login').reply((config) => {
    const body = JSON.parse(config.data as string) as LoginRequest;

    if (body.email === user.email && body.password === 'password123') {
      return [200, user];
    }
    return [401, { message: 'Invalid email or password' }];
  });

  mock.onPost('/auth/logout').reply(200);

  return mock;
}
