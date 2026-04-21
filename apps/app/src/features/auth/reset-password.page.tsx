import { Anchor, Flex } from "@mantine/core";
import { AuthCardLayout } from "./ui/auth-card-layout";
import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { useResetPasswordData } from "./model/use-reset-password-data";
import { useForgotPassword } from "./model/use-forgot-password";
import { useCodeInput } from "@/shared/ui/use-code-input";
import { useVerifyResetPasswordCode } from "./model/use-verify-reset-password-code";
import { useResetPassword } from "./model/use-reset-password";
import type { ReactNode } from "react";
import { SendResetPasswordCodeForm } from "./ui/send-reset-password-code-form";
import { SetPasswordForm } from "./ui/set-password-form";

const ResetPasswordPage = () => {
  const resetPasswordData = useResetPasswordData();
  const forgotPassword = useForgotPassword({
    onSuccess: (data) => {
      resetPasswordData.setValues(data);
      codeInput.resetInput();
    },
  });
  const codeInput = useCodeInput({
    getCodeInputProps: () => ({
      disabled: verifyResetPasswordCode.isPending,
      length: 6,
      onEntry: (code) =>
        verifyResetPasswordCode.check({
          email: resetPasswordData.values.email,
          code,
        }),
      resending: forgotPassword.isPending,
      onResend: () =>
        forgotPassword.mutate({ email: resetPasswordData.values.email }),
    }),
  });
  const verifyResetPasswordCode = useVerifyResetPasswordCode({
    onError: codeInput.handleError,
    onSuccess: resetPasswordData.setValues,
  });
  const resetPassword = useResetPassword();

  let formElement: ReactNode;
  switch (resetPasswordData.stage) {
    case "sendResetPasswordCode":
      formElement = (
        <SendResetPasswordCodeForm
          onSubmit={forgotPassword.mutate}
          isPending={forgotPassword.isPending}
        />
      );
      break;

    case "checkResetPasswordCode":
      formElement = <Flex justify="center">{codeInput.render()}</Flex>;
      break;

    case "resetPassword":
      formElement = (
        <SetPasswordForm
          isPending={resetPassword.isPending}
          onSubmit={({ password }) =>
            resetPassword.mutate({
              email: resetPasswordData.values.email,
              code: resetPasswordData.values.code,
              password,
            })
          }
        />
      );
      break;
  }

  return (
    <AuthCardLayout
      title="Сброс пароля"
      description={resetPasswordData.description}
      form={formElement}
      additional={
        <>
          Хотите использовать другой аккаунт?
          <br />
          <Anchor component={Link} to={ROUTES.LOGIN}>
            Войти
          </Anchor>{" "}
          или{" "}
          <Anchor component={Link} to={ROUTES.REGISTER}>
            Зарегистрироваться
          </Anchor>
        </>
      }
    />
  );
};

export const Component = ResetPasswordPage;
