import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferFunds } from '@modules/transfer/repository/transfers';
import { ACCOUNT_QUERY_KEY } from '@modules/accounts/configuration/constants';
import { TRANSACTIONS_KEYS } from '@modules/transactions/configuration/constants';

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
