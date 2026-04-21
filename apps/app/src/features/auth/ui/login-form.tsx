import {
  Anchor,
  Button,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../model/auth-schemas";
import { useLogin } from "../model/use-login";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";

export const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const login = useLogin();

  return (
    <form onSubmit={form.handleSubmit(login.mutate)}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="Введите email"
          autoFocus
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <PasswordInput
          label="Пароль"
          placeholder="Введите пароль"
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />

        <Flex justify="flex-end">
          <Anchor component={Link} to={ROUTES.RESET_PASSWORD} size="sm">
            Забыли пароль?
          </Anchor>
        </Flex>

        <Button type="submit" loading={login.isPending}>
          Войти
        </Button>
      </Stack>
    </form>
  );
};
