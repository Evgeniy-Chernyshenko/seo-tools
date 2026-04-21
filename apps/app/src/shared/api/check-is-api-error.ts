import z from "zod";
import type { ApiSchemas } from "./schema";

export const checkIsApiError = (
  error: unknown,
): error is ApiSchemas["ErrorDto"] => {
  const result = apiErrorDtoSchema.safeParse(error);

  return result.success;
};

const apiErrorDtoSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string().optional(),
});
