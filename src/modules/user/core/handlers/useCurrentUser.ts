import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@modules/user/repository/user";
import { USER_QUERY_KEY } from "../../configuration/constants";

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
