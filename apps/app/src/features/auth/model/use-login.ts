import { rqClient } from "@/shared/api/fetch-client";
import type { ApiSchemas } from "@/shared/api/schema";
import { ROUTES } from "@/shared/model/routes";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const mutation = rqClient.useMutation("post", "/api/v1/auth/login");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutate = (body: ApiSchemas["LoginDto"]) => {
    mutation.mutate(
      { body },
      {
        async onSuccess() {
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
