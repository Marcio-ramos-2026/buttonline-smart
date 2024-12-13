"use server";

import { signIn } from "@/auth";
import bcrypt from "bcrypt";
import { isRedirectError } from "next/dist/client/components/redirect";
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
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
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
