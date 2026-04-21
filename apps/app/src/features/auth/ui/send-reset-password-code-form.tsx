import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sendResetPasswordCodeSchema,
  type SendResetPasswordCodeSchema,
} from "../model/auth-schemas";

export const SendResetPasswordCodeForm = ({
  onSubmit,
  isPending,
}: {
  onSubmit: (values: SendResetPasswordCodeSchema) => void;
  isPending: boolean;
}) => {
  const form = useForm({
    resolver: zodResolver(sendResetPasswordCodeSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="Введите email"
          autoFocus
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <Button type="submit" loading={isPending}>
          Отправить код для сброса
        </Button>
      </Stack>
    </form>
  );
};
