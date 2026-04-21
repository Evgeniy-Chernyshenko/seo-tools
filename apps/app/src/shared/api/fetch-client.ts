import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { ApiPaths } from "./schema";

export const fetchClient = createFetchClient<ApiPaths>();

export const rqClient = createClient(fetchClient);
