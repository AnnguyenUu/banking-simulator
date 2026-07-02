import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferFunds } from '@api/banking';

export function useTransferFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
