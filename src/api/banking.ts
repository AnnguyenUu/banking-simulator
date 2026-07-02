import { apiClient } from './client';
import type { Account, Transaction, TransferRequest, TransferResult, User } from '@apptypes/banking';

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/me');
  return data;
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await apiClient.get<Account[]>('/accounts');
  return data;
}

export async function fetchTransactions(accountId?: string): Promise<Transaction[]> {
  const { data } = await apiClient.get<Transaction[]>('/transactions', {
    params: accountId ? { accountId } : undefined,
  });
  return data;
}

export async function transferFunds(request: TransferRequest): Promise<TransferResult> {
  const { data } = await apiClient.post<TransferResult>('/transfers', request);
  return data;
}
