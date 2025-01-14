import { z } from "zod";

export const createAdminSchema = (t: any) => {
  return z.object({
    name: z.string().min(1, { message: t("required.name") }),
    email: z
      .string()
      .email({ message: t("valid.email") })
      .min(1, { message: t("required.email") }),
  });
};

export type CreateAdminType = z.infer<ReturnType<typeof createAdminSchema>>;

export const deleteAdminSchema = (t: any) => {
  return z.object({
    user_id: z.number().min(1, { message: t("required.name") }),
  });
};

export type DeleteAdminType = z.infer<ReturnType<typeof deleteAdminSchema>>;

////////////////////////////////////////

export const updateUserSchema = (t: any) => {
  return z.object({
    name: z.string().min(1, { message: t("required.name") }),
    email: z
      .string()
      .email({ message: t("valid.email") })
      .min(1, { message: t("required.email") }),
  });
};

export type UpdateUserType = z.infer<ReturnType<typeof updateUserSchema>>;

////////////////////////////////////////

export const signInSchema = (t: any) => {
  return z.object({
    email: z
      .string()
      .email({ message: t("valid.email") })
      .min(1, { message: t("required.email") }),
    password: z.string().trim().min(1, { message: "Senha é obrigatória." }),
  });
};

export type SignInType = z.infer<ReturnType<typeof signInSchema>>;

////////////////////////////////////////

export const signUpSchema = (t: any) => {
  return z.object({
    name: z.string().min(1, { message: t("required.name") }),
    email: z
      .string()
      .email({ message: t("valid.email") })
      .min(1, { message: t("required.email") }),
    password: z.string().trim().min(1, { message: "Senha é obrigatória." }),
  });
};

export type SignUpType = z.infer<ReturnType<typeof signUpSchema>>;

////////////////////////////////////////

export const recoverPasswordSchema = (t?: any) => {
  return z.object({
    email: z
      .string()
      .min(1, { message: "O email é obrigatório" })
      .email("Este não é um email válido."),
  });
};

export type RecoverPasswordType = z.infer<
  ReturnType<typeof recoverPasswordSchema>
>;

////////////////////////////////////////

export const changePasswordSchema = (t?: any) => {
  return z
    .object({
      password: z.string().trim().min(1, { message: "Senha é obrigatória." }),
      confirmPassword: z
        .string()
        .trim()
        .min(1, { message: "Senha é obrigatória." }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "As senhan devem ser idênticas",
          path: ["confirmPassword"],
        });
      }
    });
};

export type ChangePasswordType = z.infer<
  ReturnType<typeof changePasswordSchema>
>;

////////////////////////////////////////

export const editProfileSchema = (t?: any) => {
  return z
    .object({
      // email: z.string().email({ message: "Email inválido" }).optional(),
      email: z.string().optional()
      .refine(value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
        message: "Email inválido",
      }),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
      name: z.string(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (!password) return;
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "As senhan devem ser idênticas",
          path: ["confirmPassword"],
        });
      }
    });
};

export type EditProfileSchema = z.infer<
  ReturnType<typeof editProfileSchema>
>;

////////////////////////////////////////
