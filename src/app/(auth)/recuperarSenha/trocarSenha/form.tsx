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
import { useSearchParams } from 'next/navigation'

export const ChangePasswordForm = () => {
    const formSchema = changePasswordSchema()
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
        password: '',
        confirmPassword: ''
    },
    resolver: zodResolver(formSchema),
  });

  const { formState, setError } = form;
  const searchParams = useSearchParams()
  const userId = searchParams.get('user_id')
  
  const onSubmit = async (data: ChangePasswordType) => {
    const result = await changePassword(data, userId as string);
    if (result.zod_errors) {
      Object.entries(result.zod_errors).forEach(([field, value]) => {
        setError(field as keyof ChangePasswordType, {
          type: "manual",
          message: value[0] ?? value,
        });
      });
    }

    //TODO arrumar tipo
    //@ts-ignore
    if (result.error) {
      setError("root.global", {
        type: "manual",
        //@ts-ignore
        message: result.error,
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
                <FormLabel>Senha:</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={formState.isSubmitting}
                  />
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
                <FormLabel>Confirmar senha:</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button full type="submit">
          Trocar senha
        </Button>
      </form>
    </Form>
  );
};
