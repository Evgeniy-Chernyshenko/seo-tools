import z from "zod";

const emailSchema = z.email("Некорректный email");

export const passwordRules = [
  {
    test: (password: string) => password.length >= 8,
    errorText: "Минимум 8 символов",
  },
  {
    test: (password: string) => /\p{Ll}/u.test(password),
    errorText: "Минимум 1 строчная буква",
  },
  {
    test: (password: string) => /\p{Lu}/u.test(password),
    errorText: "Минимум 1 заглавная буква",
  },
  {
    test: (password: string) => /\p{N}/u.test(password),
    errorText: "Минимум 1 цифра",
  },
  {
    test: (password: string) => /[^\p{L}\p{N}]/u.test(password),
    errorText: "Минимум 1 спецсимвол (!@#$ и др.)",
  },
];

const passwordSchema = passwordRules.reduce(
  (schema, rule) => schema.refine((v) => rule.test(v), rule.errorText),
  z.string(),
);

const confirmPasswordSchema = z.string();

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Введите пароль" }),
});

export const sendResetPasswordCodeSchema = z.object({ email: emailSchema });

export const setPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

export type SendResetPasswordCodeSchema = z.infer<
  typeof sendResetPasswordCodeSchema
>;

export type SetPasswordSchema = z.infer<typeof setPasswordSchema>;
