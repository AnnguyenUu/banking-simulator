import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@api/requests/auth";
import { USER_QUERY_KEY } from "@context/query-keys";

export function useLogin() {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData([USER_QUERY_KEY], user);
    },
  });

  return {
    ...mutate,
    login: mutate.mutate,
  };
}
