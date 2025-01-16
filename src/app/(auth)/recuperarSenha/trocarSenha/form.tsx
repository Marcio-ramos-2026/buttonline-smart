"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputPassword } from "@/components/ui/inputPassword";
import { changePasswordSchema, ChangePasswordType } from "@/lib/zod-schemas";
import { changePassword } from "@/app/actions/changePassword";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export const ChangePasswordForm = () => {
  const formSchema = changePasswordSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });
  const t = useTranslations("pages.recoverPassword.changePassword");
  const tToast = useTranslations("toast");

  const { formState, setError } = form;
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = async (data: ChangePasswordType) => {
    const result = await changePassword(data, token as string);
    if (result?.zod_errors) {
      Object.entries(result.zod_errors).forEach(([field, value]) => {
        setError(field as keyof ChangePasswordType, {
          type: "manual",
          message: value[0] ?? value,
        });
      });
    }

    //TODO arrumar tipo
    //@ts-ignore
    if (result?.error) {
      setError("root.global", {
        type: "manual",
        //@ts-ignore
        message: result.error,
      });
    }

    if (result?.success) {
      toast({
        title: tToast("success"),
        description: result.message,
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{t("form.labelPassword")}</FormLabel>
                <FormControl>
                  <InputPassword {...field} disabled={formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{t("form.labelConfirmPassword")}</FormLabel>
                <FormControl>
                  <InputPassword {...field} disabled={formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button full type="submit" loading={formState.isSubmitting} disabled={formState.isSubmitting}>
          {t("form.submit")}
        </Button>
      </form>
    </Form>
  );
};
