"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { createAdminSchema, CreateAdminType } from "@/lib/zod-schemas";
import { getTranslations } from "next-intl/server";
import { hasPermission } from "@/lib/permission-server";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import { renderFirstAccess } from "@/emails/admin/firstAccess/firstAccessAdmin";
import { mailTransport } from "@/lib/email";

function generateTempPassword(length: number = 8): string {
  return randomBytes(length).toString("base64").slice(0, length); // Gera uma string base64 e corta no tamanho desejado
}

export async function createAdminAction(data: CreateAdminType) {
  const t = await getTranslations("pages.generalApiReturns");

  if (!(await hasPermission([ALLOWED_PERMISSIONS.ADMIN_USER_CREATE]))) {
    return { error: t("permissionDenied") };
  }

  const tForm = await getTranslations("pages.generalZodErrors");
  const schema = createAdminSchema(tForm);

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const tempPassword = generateTempPassword();
    const pass = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: pass,
        role: {
          connect: {
            id: 1, //always register with a admin role
          },
        },
      },
    });
    const htmlEmail = await renderFirstAccess({
      locale: "pt-BR",
      user: user,
      tempPassword: tempPassword
    });
    const transport = await mailTransport();
    if (transport) {
      await transport.sendMail({
        from: process.env.EMAIL_SENDER,
        to: user.email as string,
        subject: "Buttonline - Bem vindo novo administrador.",
        html: htmlEmail,
      });
    }
    return {
      success: true,
      message: t("user.createdSuccess"),
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
      error: t("user.createdError"),
    };
  }
}
