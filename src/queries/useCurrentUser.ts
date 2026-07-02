import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@api/banking';

export function useCurrentUser() {
  return useQuery({ queryKey: ['me'], queryFn: fetchCurrentUser });
}
