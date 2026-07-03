import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../http/client';
import type { Account } from '@apptypes/accounts';
import type { User } from '@apptypes/user';

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

export function installMockBackend() {
  const mock = new MockAdapter(apiClient, { delayResponse: 300 });

  mock.onGet('/me').reply(200, user);

  mock.onGet('/accounts').reply(() => [
    200,
    { data: accounts, page: 1, perPage: accounts.length, total: accounts.length, totalPages: 1 },
  ]);

  return mock;
}
