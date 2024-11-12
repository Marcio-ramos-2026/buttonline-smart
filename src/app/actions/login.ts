"use server";

import { signIn } from "@/auth";
import bcrypt from 'bcrypt'
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";

const schema = z.object({
  email: z
    .string({ message: "Email obrigatório." })
    .email({ message: "Email inválido." }),
  password: z.string().trim().min(1, { message: "Senha é obrigatória." }),
});

export async function loginAction(prevState: any, formData: FormData) {  
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedFields = schema.safeParse({
    email: rawFormData.email,
    password: rawFormData.password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email: formData.get("email"),
      password: formData.get("password"),
    });
    // redirect("/");
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }
    console.log("error", e);
  }

  return {
    message: "",
  };
}
