import { useCodeInput } from "@/shared/ui/use-code-input";
import { Flex } from "@mantine/core";
import { useVerifyEmail } from "../model/use-verify-email";
import { useResendEmailVerificationCode } from "../model/use-resend-verification-code";

export const VerifyEmailForm = () => {
  const codeInput = useCodeInput({
    getCodeInputProps: () => ({
      length: 6,
      disabled: resendEmailVerificationCode.isPending,
      onEntry: verifyEmail.mutate,
      onResend: resendEmailVerificationCode.mutate,
      resending: resendEmailVerificationCode.isPending,
    }),
  });
  const verifyEmail = useVerifyEmail({
    onError: codeInput.handleError,
  });
  const resendEmailVerificationCode = useResendEmailVerificationCode({
    onResendVerificationCode: codeInput.resetInput,
  });

  return <Flex justify="center">{codeInput.render()}</Flex>;
};
