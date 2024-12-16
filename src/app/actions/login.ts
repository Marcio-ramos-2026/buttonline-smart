"use server";

import { signIn } from "@/auth";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { SignInType, signInSchema } from "@/lib/zod-schemas";
import { getTranslations } from "next-intl/server";

export async function loginAction(data: SignInType) {
  const tForm = await getTranslations("pages.generalZodErrors");
  const schema = signInSchema(tForm);

  const validatedFields = schema.safeParse({
    email: data.email,
    password: data.password,
  });

  if (!validatedFields.success) {
    return {
      zod_errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    redirect("/");
  } catch (e) {
    console.log("error on login", e);
    if (isRedirectError(e)) {
      throw e;
    }
    return{
      error: 'Usuário ou senha inválidos.'
    }
  }
}
