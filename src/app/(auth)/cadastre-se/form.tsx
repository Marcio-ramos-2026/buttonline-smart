"use client";

import { registerAction } from "@/app/actions/register";
import { Alert } from "@/components/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/inputPassword";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema, SignUpType } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const t = useTranslations("pages.signUp");
  const tForm = useTranslations("pages.generalZodErrors");
  const formSchema = signUpSchema(tForm);
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { formState, setError } = form;

  const onSubmit = async (data: SignUpType) => {
    const result = await registerAction(data);
    if (result.zod_errors) {
      Object.entries(result.zod_errors).forEach(([field, value]) => {
        setError(field as keyof SignUpType, {
          type: "manual",
          message: value[0] ?? value,
        });
      });
    }

    if (result.error) {
      setError("root.global", {
        type: "manual",
        message: result.error,
      });
    }

    if (result.success) {
      toast({
        title: 'Sucesso',
        description: result.message
      })
      router.push(result.redirectUrl)
    }

    // result.message - SUCESSO

    // console.log("resultttttttttt", result);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.labelName")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            title="Falha ao cadastrar-se"
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
