import { useEffect } from "react";
import { useWatch, type FieldPath, type UseFormReturn } from "react-hook-form";

export const useConfirmPasswordRevalidation = <
  TFieldValues extends { password: string; confirmPassword: string },
>(
  form: UseFormReturn<TFieldValues>,
) => {
  const watchedPassword = useWatch({
    control: form.control,
    name: "password" as FieldPath<TFieldValues>,
  });
  const isTouchedConfirmPassword = Boolean(
    form.formState.touchedFields.confirmPassword,
  );

  useEffect(() => {
    if (!isTouchedConfirmPassword && !form.formState.isSubmitted) {
      return;
    }

    form.trigger("confirmPassword" as FieldPath<TFieldValues>);
  }, [watchedPassword, isTouchedConfirmPassword, form]);

  return { watchedPassword };
};
