import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { showNotification } from "../lib/show-notification";
import { checkIsApiError } from "./check-is-api-error";
import { ROUTES } from "../model/routes";
import { routerNavigate } from "../lib/router-navigate";

const handle401ApiError = (error: unknown) => {
  if (checkIsApiError(error) && error.statusCode === 401) {
    queryClient.clear();

    routerNavigate(ROUTES.LOGIN);
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
    },
    mutations: {
      onError(error) {
        const isApiError = checkIsApiError(error);

        if (isApiError && error.statusCode === 401) {
          return;
        }

        showNotification({
          title: "Ошибка",
          message: isApiError ? error.message : "Что-то пошло не так",
          type: "error",
        });
      },
    },
  },
  queryCache: new QueryCache({
    onError: handle401ApiError,
  }),
  mutationCache: new MutationCache({ onError: handle401ApiError }),
});
