"use server";

import { changePasswordSchema, ChangePasswordType } from "@/lib/zod-schemas";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function changePassword(
  data: ChangePasswordType,
  user_id: number
) {
  if (!user_id)
    return {
      error: "Ocorreu um erro, contate o suporte.",
    };
  const schema = changePasswordSchema();

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
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

  return {
    message: "",
  };
}
