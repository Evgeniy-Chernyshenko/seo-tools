import { Anchor } from "@mantine/core";
import { AuthCardLayout } from "./ui/auth-card-layout";
import { RegisterForm } from "./ui/register-form";
import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <AuthCardLayout
      title="Регистрация"
      form={<RegisterForm />}
      additional={
        <>
          Уже есть аккаунт?{" "}
          <Anchor component={Link} to={ROUTES.LOGIN}>
            Войти
          </Anchor>
        </>
      }
    />
  );
};

export const Component = RegisterPage;
