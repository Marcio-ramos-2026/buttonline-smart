"use server";

import { changePasswordSchema, ChangePasswordType } from "@/lib/zod-schemas";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function changePassword(
  data: ChangePasswordType,
  token: string
) {
  if (!token)
    return {
      error: "Ocorreu um erro, contate o suporte.",
    };
  const schema = changePasswordSchema();
  const validatedFields = schema.safeParse(data);
  const now = new Date()

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const validateToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: token
      }
    })

    if (!validateToken) {
      return {
        error: 'Ocorreu um erro, contate o suporte.'
      }
    }

    if (new Date(validateToken?.expires as Date).getTime() < now.getTime()) {
      return {
        error: 'Token expirado, refaça a operação.'
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        email: validateToken?.email,
      },
    });

    if (!user) return {
      error: "Ocorreu um erro, contate o suporte.",
    }

    const password = await bcrypt.hash(data.password, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: password,
      },
    });

    await prisma.passwordResetToken.delete({
      where: {
        token: token
      }
    })

    return {
      message: 'Senha trocada com sucesso!',
      success: true
    }
  } catch (e) {
    console.log("CHANGE PASSWORD ERROR", e);
    return {
      error: "Ocorreu um erro, contate o suporte.",
    };
  }
}
