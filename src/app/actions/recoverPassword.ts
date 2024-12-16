"use server";

import { renderRecoverPassword } from "@/emails/recoverPassword/recoverPassword";
import { mailTransport } from "@/lib/email";
import { recoverPasswordSchema, RecoverPasswordType } from "@/lib/zod-schemas";
import { prisma } from "@/lib/prisma";

export async function recoverPassword(data: RecoverPasswordType) {
  const schema = recoverPasswordSchema();

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) return {
      error: 'Email não encontrado.'
    }

    const htmlEmail = await renderRecoverPassword({ locale: "pt-BR", user: user });
    const transport = await mailTransport();
    if (transport) {
      await transport.sendMail({
        from: process.env.EMAIL_SENDER,
        to: user.email as string,
        subject: "Recuperar senha.",
        html: htmlEmail,
      });
    }
  } catch (e) {
    console.log('ERROR RECOVER PASSWORD ACTION', e)
    return {
      error: 'Ocorreu um erro, contate o suporte.'
    }
  }

  return {
    message: "",
  };
}
