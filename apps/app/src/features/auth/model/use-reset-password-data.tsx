import { Text } from "@mantine/core";
import { useState, type ReactNode } from "react";

type ResetPasswordData = { email: string; code: string };

type ResetPasswordStage =
  | "sendResetPasswordCode"
  | "checkResetPasswordCode"
  | "resetPassword";

export const useResetPasswordData = () => {
  const [data, setData] = useState<ResetPasswordData>({
    email: "",
    code: "",
  });

  const setValues = (patch: Partial<ResetPasswordData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const stage: ResetPasswordStage = !data.email
    ? "sendResetPasswordCode"
    : !data.code
      ? "checkResetPasswordCode"
      : "resetPassword";

  const descriptionByStage: Partial<Record<ResetPasswordStage, ReactNode>> = {
    sendResetPasswordCode:
      "Введите email вашего аккаунта, отправим на него код для сброса пароля",
    checkResetPasswordCode: (
      <>
        На email{" "}
        <Text span fw="bold">
          {data.email}
        </Text>{" "}
        был отправлен код, пожалуйста введите его
      </>
    ),
    resetPassword: "Всё готово для установки нового пароля",
  };

  return {
    values: data,
    setValues,
    stage,
    description: descriptionByStage[stage],
  };
};
