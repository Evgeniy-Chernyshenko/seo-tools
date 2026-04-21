import { rqClient } from "@/shared/api/fetch-client";
import type { ApiSchemas } from "@/shared/api/schema";
import { ROUTES } from "@/shared/model/routes";
import { showNotification } from "@/shared/lib/show-notification";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
  const mutation = rqClient.useMutation("post", "/api/v1/auth/reset-password");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutate = (data: ApiSchemas["ResetPasswordDto"]) => {
    mutation.mutate(
      { body: data },
      {
        async onSuccess() {
          await queryClient.invalidateQueries(
            rqClient.queryOptions("get", "/api/v1/users/me"),
          );

          showNotification({
            title: "Сброс пароля",
            message: "Ваш пароль успешно изменен",
          });

          navigate(ROUTES.INDEX);
        },
      },
    );
  };

  return { mutate, isPending: mutation.isPending };
};
