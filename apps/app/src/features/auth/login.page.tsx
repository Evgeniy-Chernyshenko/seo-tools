import { Anchor } from "@mantine/core";
import { AuthCardLayout } from "./ui/auth-card-layout";
import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { LoginForm } from "./ui/login-form";

const LoginPage = () => {
  return (
    <AuthCardLayout
      title="Вход"
      form={<LoginForm />}
      additional={
        <>
          Нет аккаунта?{" "}
          <Anchor component={Link} to={ROUTES.REGISTER}>
            Зарегистрироваться
          </Anchor>
        </>
      }
    />
  );
};

export const Component = LoginPage;
