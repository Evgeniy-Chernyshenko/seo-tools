import { rqClient } from "@/shared/api/fetch-client";
import type { ApiPaths } from "@/shared/api/schema";
import { showNotification } from "@/shared/lib/show-notification";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useOAuth = () => {
  const mutation = rqClient.useMutation("post", "/api/v1/oauth/{provider}");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "oauth") {
      showNotification({
        id: "oauthError",
        type: "error",
        title: "Ошибка OAuth",
        message: "Не удалось войти через внешний сервис",
      });

      setSearchParams(
        (nextInit) => {
          nextInit.delete("error");

          return nextInit;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  const mutate = (
    provider: ApiPaths["/api/v1/oauth/{provider}"]["post"]["parameters"]["path"]["provider"],
  ) => {
    mutation.mutate(
      {
        params: {
          path: { provider },
        },
      },
      {
        onSuccess(data) {
          window.location.assign(data.redirectUrl);
        },
      },
    );
  };

  const isPendingProvider = (
    provider: ApiPaths["/api/v1/oauth/{provider}"]["post"]["parameters"]["path"]["provider"],
  ) => {
    return (
      mutation.isPending && provider === mutation.variables.params.path.provider
    );
  };

  return {
    mutate,
    isPendingProvider,
  };
};
