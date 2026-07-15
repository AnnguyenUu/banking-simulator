import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@modules/auth/repository/auth";
import { USER_QUERY_KEY } from "@modules/user/configuration/constants";

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
