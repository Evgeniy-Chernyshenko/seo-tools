import { rqClient } from "@/shared/api/fetch-client";
import type { ApiSchemas } from "@/shared/api/schema";

export const useForgotPassword = ({
  onSuccess,
}: {
  onSuccess: (data: ApiSchemas["ForgotPasswordDto"]) => void;
}) => {
  const mutation = rqClient.useMutation("post", "/api/v1/auth/forgot-password");

  const mutate = (data: ApiSchemas["ForgotPasswordDto"]) => {
    mutation.mutate(
      { body: data },
      {
        onSuccess() {
          onSuccess(data);
        },
      },
    );
  };

  return { mutate, isPending: mutation.isPending };
};
