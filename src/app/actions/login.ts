"use server";

import { signIn } from "../api/auth/[...nextauth]/route";
import { z } from 'zod'
 
const schema = z.object({
  email: z.string({ message: 'Email obrigatório.' }).email({ message: 'Email inválido.' }),
  password: z.string().trim().min(1, { message: 'Senha é obrigatória.' })
})

export async function loginAction(prevState: any, formData: FormData) {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedFields = schema.safeParse({
    email: rawFormData.email,
    password: rawFormData.password,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  if (rawFormData.email !== 'fernando@email.com') {
    return {
      message: 'Email inválido'
    }
  }

  if (rawFormData.password !== '1234') {
    return {
      message: 'Senha inválida'
    }
  }

  await signIn('credentials', formData)

  return {
    message: "",
  };
}
