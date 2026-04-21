import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordRules, registerSchema } from "../model/auth-schemas";
import { useRegister } from "../model/use-register";
import { PasswordStrengthMeterPopover } from "./password-strength-meter-popover";
import { useConfirmPasswordRevalidation } from "../model/use-confirm-password-revalidation";

export const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const register = useRegister();
  const { watchedPassword } = useConfirmPasswordRevalidation(form);

  return (
    <form onSubmit={form.handleSubmit(register.mutate)}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="Введите email"
          autoFocus
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <PasswordStrengthMeterPopover
          password={watchedPassword}
          rules={passwordRules}
        >
          <PasswordInput
            label="Пароль"
            placeholder="Введите пароль"
            {...form.register("password")}
            error={Boolean(form.formState.errors.password)}
          />
        </PasswordStrengthMeterPopover>

        <PasswordInput
          label="Повтор пароля"
          placeholder="Введите повтор пароля"
          {...form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />

        <Button type="submit" loading={register.isPending}>
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  );
};
