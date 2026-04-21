import { rqClient } from "@/shared/api/fetch-client";
import { showNotification } from "@/shared/lib/show-notification";

export const useResendEmailVerificationCode = ({
  onResendVerificationCode,
}: {
  onResendVerificationCode: VoidFunction;
}) => {
  const mutation = rqClient.useMutation(
    "post",
    "/api/v1/auth/resend-email-verification-code",
  );

  const mutate = () => {
    mutation.mutate(
      {},
      {
        onSuccess() {
          showNotification({
            title: "Код отправлен",
            message: "Код успешно отправлен на ваш email",
          });

          onResendVerificationCode();
        },
      },
    );
  };

  return { mutate, isPending: mutation.isPending };
};
