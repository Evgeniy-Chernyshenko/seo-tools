import { Anchor, Text } from "@mantine/core";
import { AuthCardLayout } from "./ui/auth-card-layout";
import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { useMe } from "@/shared/model/use-me";
import { VerifyEmailForm } from "./ui/verify-email-form";

const VerifyEmailPage = () => {
  const me = useMe();

  const email = me.data?.email;

  return (
    <AuthCardLayout
      title="Подтверждение email"
      description={
        <>
          На email{" "}
          <Text span fw="bold">
            {email}
          </Text>{" "}
          был отправлен код, пожалуйста введите его
        </>
      }
      form={<VerifyEmailForm />}
      additional={
        <>
          Хотите использовать другой аккаунт?{" "}
          <Anchor component={Link} to={ROUTES.LOGIN}>
            Войти
          </Anchor>
          &nbsp;или&nbsp;
          <Anchor component={Link} to={ROUTES.REGISTER}>
            Зарегистрироваться
          </Anchor>
        </>
      }
    />
  );
};

export const Component = VerifyEmailPage;
