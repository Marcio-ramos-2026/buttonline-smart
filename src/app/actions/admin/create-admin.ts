"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const schema = z.object({
  name: z.string().min(1, { message: "O nome de usuário é obrigatório" }),
  email: z.string().min(1, { message: "A senha é obrigatória" }),
});

function generateTempPassword(length: number = 8): string {
  return randomBytes(length).toString("base64").slice(0, length); // Gera uma string base64 e corta no tamanho desejado
}

export async function createAdminAction(prevState: any, formData: FormData) {
  const rawFormData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = schema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const tempPassword = generateTempPassword();
    const pass = await bcrypt.hash(tempPassword, 10);

    await prisma.user.create({
      data: {
        name: rawFormData.name,
        email: rawFormData.email,
        password: pass,
        role: {
          connect: {
            id: 1, //always register with a admin role
          },
        },
      },
    });
    return {
      message: "Usurário criado com sucesso",
    };
  } catch (e) {
    console.log("Error register action", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          if (e.meta && e.meta?.target === "users_email_key") {
            return { error: "Este e-mail já está em uso." };
          }
          break;
        default:
          return {
            error: "Erro ao criar usuário, por favor contate o suporte",
          };
      }
    }

    return {
      error: "Erro ao criar usuário, por favor contate o suporte",
    };
  }
}
