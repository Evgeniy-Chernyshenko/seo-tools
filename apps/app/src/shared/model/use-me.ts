import { rqClient } from "../api/fetch-client";

export const useMe = () => {
  const { data, isPending } = rqClient.useQuery("get", "/api/v1/users/me");

  return { data, isPending };
};
