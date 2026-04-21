import { rqClient } from "@/shared/api/fetch-client";
import type { ApiSchemas } from "@/shared/api/schema";

export const useVerifyResetPasswordCode = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ApiSchemas["VerifyResetPasswordCodeDto"]) => void;
  onError: VoidFunction;
}) => {
  const mutation = rqClient.useMutation(
    "post",
    "/api/v1/auth/verify-reset-password-code",
  );

  const check = (data: ApiSchemas["VerifyResetPasswordCodeDto"]) => {
    mutation.mutate(
      { body: data },
      {
        onError,
        onSuccess() {
          onSuccess(data);
        },
      },
    );
  };

  return { check, isPending: mutation.isPending };
};
