"use client";

import { loginAction } from "@/app/actions/login";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/inputPassword";
import { Button } from "@/components/ui/button";
import { signInSchema, SignInType } from "@/lib/zod-schemas";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Alert } from "@/components/alert";

export const FormLogin = () => {
  const t = useTranslations("pages.signIn");
  const tForm = useTranslations("pages.generalZodErrors");
  const formSchema = signInSchema(tForm);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { formState, setError } = form;

  const onSubmit = async (data: SignInType) => {
    const result = await loginAction(data);

    // if (result.zod_errors) {
    //   Object.entries(result.zod_errors).forEach(([field, value]) => {
    //     setError(field as keyof SignInType, {
    //       type: "manual",
    //       message: value[0] ?? value,
    //     });
    //   });
    // }

    // if (result.error) {
    //   setError("root.global", {
    //     type: "manual",
    //     message: result.error,
    //   });
    // }

    // result.message - SUCESSO

    console.log("result", result);
  };

  // console.log("state login", state);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.labelEmail")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.labelPassword")}</FormLabel>
              <FormControl>
                <InputPassword {...field} disabled={formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formState.errors.root?.global.message && (
          <Alert
            variant="danger"
            content={formState.errors.root?.global.message as string}
            title="Falha ao entrar"
          />
        )}

        <Button
          full
          className="mt-4"
          loading={formState.isSubmitting}
          disabled={formState.isSubmitting}
          type="submit"
        >
          {t("form.submit")}
        </Button>
      </form>
    </Form>
  );
};
