import { createBrowserRouter, Outlet } from "react-router-dom";
import { APP_BASENAME, ROUTES } from "@/shared/model/routes";
import { Providers } from "./providers";
import { AuthLayout } from "./auth-layout";
import { requireAuthLoader } from "@/features/auth";

export const router = createBrowserRouter(
  [
    {
      element: (
        <Providers>
          <Outlet />
        </Providers>
      ),
      HydrateFallback: () => null,

      children: [
        {
          element: <AuthLayout />,
          children: [
            {
              path: ROUTES.REGISTER,
              lazy: () => import("@/features/auth/register.page"),
            },
            {
              path: ROUTES.VERIFY_EMAIL,
              loader: requireAuthLoader,
              lazy: () => import("@/features/auth/verify-email.page"),
            },
            {
              path: ROUTES.LOGIN,
              lazy: () => import("@/features/auth/login.page"),
            },
            {
              path: ROUTES.RESET_PASSWORD,
              lazy: () => import("@/features/auth/reset-password.page"),
            },
          ],
        },

        {
          loader: requireAuthLoader,
          children: [{ index: true, element: "INDEX" }],
        },
      ],
    },
  ],
  { basename: APP_BASENAME },
);
