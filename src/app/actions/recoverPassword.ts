'use server'

import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, { message: "O email é obrigatório" }),
});

export async function recoverPassword(data: { email: string }) {
  console.log("EMAIL RECOVER PASSWORD", data);

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return {
    message: ''
  }
}
