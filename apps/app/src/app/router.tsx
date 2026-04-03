import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";

export const router = createBrowserRouter(
  [
    {
      path: ROUTES.REGISTER,
      lazy: () => import("@/features/auth/register.page"),
    },
    {
      path: ROUTES.LOGIN,
      lazy: () => import("@/features/auth/login.page"),
    },
  ],
  { basename: "/app" },
);
