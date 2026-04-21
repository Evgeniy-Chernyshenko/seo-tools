import { APP_BASENAME, ROUTES } from "@/shared/model/routes";
import { matchPath, redirect, type LoaderFunction } from "react-router-dom";
import { queryClient } from "@/shared/api/query-client";
import { rqClient } from "@/shared/api/fetch-client";

export const requireAuthLoader: LoaderFunction = async ({ request }) => {
  const user = await queryClient.fetchQuery(
    rqClient.queryOptions("get", "/api/v1/users/me"),
  );

  const { pathname } = new URL(request.url);
  const isVerifyEmailRoute = matchPath(
    `${APP_BASENAME}${ROUTES.VERIFY_EMAIL}`,
    pathname,
  );

  if (!user.isVerified && !isVerifyEmailRoute) {
    return redirect(ROUTES.VERIFY_EMAIL);
  }
};
