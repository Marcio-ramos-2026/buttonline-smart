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

const formSchema = z.object({
  email: z.string().min(1, { message: "O email é obrigatório" }),
});

export const RecoverPasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
        email: ''
    },
    resolver: zodResolver(formSchema),
  });

  const { formState, setError } = form;

  const onSubmit = async (data: { email: string }) => {
    const result = await recoverPassword(data);
    if (result.zod_errors) {
      Object.entries(result.zod_errors).forEach(([field, value]) => {
        setError(field as keyof { email: string }, {
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
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email:</FormLabel>
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
        <Button full type="submit">
          Recuperar senha
        </Button>
      </form>
    </Form>
  );
};
