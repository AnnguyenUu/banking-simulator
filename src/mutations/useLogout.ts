import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@api/requests/auth";

export function useLogout() {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    ...mutate,
    logout: mutate.mutate,
  };
}
