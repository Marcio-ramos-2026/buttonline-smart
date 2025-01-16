"use server";

import { renderRecoverPassword } from "@/emails/recoverPassword/recoverPassword";
import { mailTransport } from "@/lib/email";
import { recoverPasswordSchema, RecoverPasswordType } from "@/lib/zod-schemas";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

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

    const expiresDate = new Date()
    expiresDate.setMinutes(expiresDate.getMinutes() + 5);
    const createToken = await prisma.passwordResetToken.create({
      data: {
        email: user?.email as string,
        expires: expiresDate,
        token: uuidv4()
      }
    })

    if (!createToken)  return {
      error: 'Ocorreu um erro interno, contate o suporte.'
    }

    const htmlEmail = await renderRecoverPassword({ locale: "pt-BR", user: user, token: createToken.token });
    const transport = await mailTransport();
    if (transport) {
      await transport.sendMail({
        from: process.env.EMAIL_SENDER,
        to: user.email as string,
        subject: "Recuperar senha.",
        html: htmlEmail,
      });
    }
    return {
      message: `Uma mensagem foi enviada para o email: ${user.email}, abra a mensagem e acesse o link para recuperar sua senha.`,
      success: true
    }
  } catch (e) {
    console.log('ERROR RECOVER PASSWORD ACTION', e)
    return {
      error: 'Ocorreu um erro, contate o suporte.'
    }
  }
}
