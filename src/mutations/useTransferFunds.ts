import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferFunds } from '@api/banking';
import { ACCOUNT_QUERY_KEY, TRANSACTIONS_KEYS } from '@context/query-keys';

export function useTransferFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEYS] });
    },
  });
}
