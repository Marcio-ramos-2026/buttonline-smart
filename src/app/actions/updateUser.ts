"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import { hasPermission } from "@/lib/permission-server";
import { getTranslations } from "next-intl/server";
import { updateUserSchema, UpdateUserType } from "@/lib/zod-schemas";

export async function updateUserAction(
  data: UpdateUserType,
  userId: number,
  roleId: number
) {
  const t = await getTranslations("pages.generalApiReturns");
  if (!(await hasPermission([ALLOWED_PERMISSIONS.ADMIN_USER_EDIT]))) {
    return { error: t("permissionDenied") };
  }

  const tForm = await getTranslations("pages.generalZodErrors");
  const schema = updateUserSchema(tForm);

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        email: data.email,
        role: {
          connect: {
            id: roleId,
          },
        },
      },
    });
    return {
      message: t("user.updatedSuccess"),
    };
  } catch (e) {
    console.log("Error register action", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          if (e.meta && e.meta?.target === "users_email_key") {
            return { error: t("user.emailInUse") };
          }
          break;
        default:
          return {
            error: t("user.createdError"),
          };
      }
    }

    return {
      error: t("user.updatedError"),
    };
  }
}
