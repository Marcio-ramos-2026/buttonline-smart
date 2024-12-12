"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import { hasPermission } from "@/lib/permission-server";

const schema = z.object({
  name: z.string().min(1, { message: "O nome de usuário é obrigatório" }),
  email: z.string().min(1, { message: "A senha é obrigatória" }),
});

export type updateUserType = z.infer<typeof schema>;

export async function updateUserAction(
  data: updateUserType,
  userId: string,
  roleId: number
) {
  if(!await hasPermission([ALLOWED_PERMISSIONS.ADMIN_USER_EDIT])) {
    return {error: "Permissão invalida"}
  }
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
