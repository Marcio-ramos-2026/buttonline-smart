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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { recoverPassword } from "@/app/actions/recoverPassword";
import { Mail } from "lucide-react";
import { recoverPasswordSchema, RecoverPasswordType } from "@/lib/zod-schemas";
import { Alert } from "@/components/alert";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export const RecoverPasswordForm = () => {
  const formSchema = recoverPasswordSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { formState, setError } = form;
  const t = useTranslations("pages.recoverPassword");

  const onSubmit = async (data: RecoverPasswordType) => {
    const result = await recoverPassword(data);
    if (result?.zod_errors) {
      Object.entries(result.zod_errors).forEach(([field, value]) => {
        setError(field as keyof RecoverPasswordType, {
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
        title: "Sucesso",
        description: result.message,
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{t("form.labelEmail")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={formState.isSubmitting}
                    icon={<Mail />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {formState.errors.root?.global && (
          <Alert
            variant="danger"
            content={formState.errors.root.global.message as string}
          />
        )}
        <Button full type="submit" loading={formState.isSubmitting} disabled={formState.isSubmitting}>
          {t("form.submit")}
        </Button>
      </form>
    </Form>
  );
};
