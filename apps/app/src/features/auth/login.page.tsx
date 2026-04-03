import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <>
      LoginPage <Link to={ROUTES.REGISTER}>Register</Link>
    </>
  );
};

export const Component = LoginPage;
