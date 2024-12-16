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
    user_id: z.number().min(1, { message: t("required.name") })
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
