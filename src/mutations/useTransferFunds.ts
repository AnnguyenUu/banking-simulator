import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferFunds } from '@api/requests/transfers';
import { ACCOUNT_QUERY_KEY, TRANSACTIONS_KEYS } from '@context/query-keys';

export function useTransferFunds() {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEYS] });
    },
  });

  return {
    ...mutate,
    transfer: mutate.mutate,
  }
}
