import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@api/banking';

export function useTransactions(accountId?: string) {
  return useQuery({
    queryKey: ['transactions', accountId ?? 'all'],
    queryFn: () => fetchTransactions(accountId),
  });
}
