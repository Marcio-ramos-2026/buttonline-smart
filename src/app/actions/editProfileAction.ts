import { editProfileSchema, EditProfileSchema } from "@/lib/zod-schemas";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

type WhereUpdateProfile = {
    email?: string
    name?: string
    password?: string
    confirmPassword?: string
}

export async function editProfileAction(userId: number, data: EditProfileSchema) {
  const tForm = await getTranslations("pages.generalZodErrors");
  const schema = editProfileSchema(tForm);

  console.log('DATAAAAAAA', data)

  const validatedFields = schema.safeParse({
    email: data.email,
    name: data.name,
    password: data.password,
    confirmPassword: data.confirmPassword
  });

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let updateUserWhere: WhereUpdateProfile = {}

  if (data.email) updateUserWhere['email'] = data.email
  if (data.name) updateUserWhere['name'] = data.name
  if (data.password && data.confirmPassword) {
    updateUserWhere['password'] = data.password
    updateUserWhere['confirmPassword'] = data.confirmPassword
  }

  console.log('ACTION EDIT WHERE', updateUserWhere)

  try {
    // const user = await prisma.user.findFirst({
    //   where: {
    //     id: userId,
    //   },
    // });

    // if (!user)
    //   return {
    //     error: "Usuário não encontrado.",
    //   };

    // const updateUser = await prisma.user.update({
    //     where: {
    //         id: user.id
    //     },
    //     data: updateUserWhere
    // })

    return {
      message: `Dados salvos com sucesso.`,
      success: true,
    };
  } catch (e) {
    console.log("ERROR EDIT PROFILE ACTION", e);
    return {
      error: "Ocorreu um erro, contate o suporte.",
    };
  }
}
