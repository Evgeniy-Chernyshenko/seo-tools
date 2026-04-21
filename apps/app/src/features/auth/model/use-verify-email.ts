import { rqClient } from "@/shared/api/fetch-client";
import { showNotification } from "@/shared/lib/show-notification";
import { ROUTES } from "@/shared/model/routes";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useVerifyEmail = ({ onError }: { onError: VoidFunction }) => {
  const mutation = rqClient.useMutation("post", "/api/v1/auth/verify-email");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutate = (code: string) => {
    mutation.mutate(
      { body: { code } },
      {
        onError,
        async onSuccess() {
          showNotification({
            title: "Email подтвержден",
            message: "Вы успешно подтвердили email",
          });

          await queryClient.invalidateQueries(
            rqClient.queryOptions("get", "/api/v1/users/me"),
          );

          navigate(ROUTES.INDEX);
        },
      },
    );
  };

  return { mutate, isPending: mutation.isPending };
};
