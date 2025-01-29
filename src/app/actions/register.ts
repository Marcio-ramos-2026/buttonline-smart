"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { renderClientWelcome } from "@/emails/clients/welcome";
import { mailTransport } from "@/lib/email";
import { getTranslations } from "next-intl/server";
import { signUpSchema, SignUpType } from "@/lib/zod-schemas";
import { validateVoucher } from "@/lib/validateVoucher";

export async function registerAction(data: SignUpType) {
  const tForm = await getTranslations("pages.generalZodErrors");
  const schema = signUpSchema(tForm);

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const pass = await bcrypt.hash(data.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: pass,
        role: {
          connect: {
            id: 2, //always register with a user role
          },
        },
      },
    });

    const htmlEmail = await renderClientWelcome({ locale: "pt-BR", user: createdUser });
    const transport = await mailTransport();
    if (transport) {
      await transport.sendMail({
        from: process.env.EMAIL_SENDER,
        to: data.email,
        subject: "Cadastro na plataforma Buttonline",
        html: htmlEmail,
      });
    }

    const voucher = await validateVoucher(createdUser);

    return {
      message: "Usurário criado com sucesso",
      redirectUrl: "/login",
      success: true,
    };
  } catch (e) {
    console.log("Error register action", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          if (e.meta && e.meta?.target === "users_email_key") {
            return { error: "Este e-mail já está em uso." };
            // return {zod_errors:{email: 'Este e-mail já está em uso.'}};
          }
          break;
        default:
          return {
            error: "Erro ao criar usuário, por favor contate o suporte",
          };
      }
    }
  }
}
