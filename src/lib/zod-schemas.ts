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
