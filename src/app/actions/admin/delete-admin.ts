"use server";

import { hasPermission } from "@/lib/permission-server";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { getTranslations } from "next-intl/server";


export async function deleteAdminAction(id: number) {
  const t = await getTranslations("pages.generalApiReturns");

  if(id < 1) return {
    message: t("missingId")
  }

  if (!(await hasPermission([ALLOWED_PERMISSIONS.ADMIN_USER_DELETE]))) {
    return { error: t("permissionDenied") };
  }


  try {
    
    const user = await prisma.user.delete({
      where: {
        id: id
      }
    });
    if(!user){
      return {message: "Usuário não existe"}
    }
    return {
      message: t("user.createdSuccess"),
    };
  } catch (e) {
    console.log("Error register action", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        default:
          return {
            error: t("user.createdError"),
          };
      }
    }

    return {
      error: t("user.createdError"),
    };
  }
}
