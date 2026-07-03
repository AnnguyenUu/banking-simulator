import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@api/requests/user";
import { USER_QUERY_KEY } from "@context/query-keys";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: fetchCurrentUser,
    staleTime: Infinity,
  });
  return {
    ...query,
    user: query?.data,
  };
}
