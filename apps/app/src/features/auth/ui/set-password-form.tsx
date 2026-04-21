import { Button, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordRules,
  setPasswordSchema,
  type SetPasswordSchema,
} from "../model/auth-schemas";
import { PasswordStrengthMeterPopover } from "./password-strength-meter-popover";
import { useConfirmPasswordRevalidation } from "../model/use-confirm-password-revalidation";

export const SetPasswordForm = ({
  onSubmit,
  isPending,
}: {
  onSubmit: (values: SetPasswordSchema) => void;
  isPending: boolean;
}) => {
  const form = useForm({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { watchedPassword } = useConfirmPasswordRevalidation(form);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="md">
        <PasswordStrengthMeterPopover
          password={watchedPassword}
          rules={passwordRules}
        >
          <PasswordInput
            label="Новый пароль"
            placeholder="Введите новый пароль"
            {...form.register("password")}
            error={Boolean(form.formState.errors.password)}
          />
        </PasswordStrengthMeterPopover>

        <PasswordInput
          label="Повтор нового пароля"
          placeholder="Введите повтор нового пароля"
          {...form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />

        <Button type="submit" loading={isPending}>
          Установить новый пароль
        </Button>
      </Stack>
    </form>
  );
};
