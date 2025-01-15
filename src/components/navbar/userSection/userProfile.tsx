"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/inputPassword";
import { Alert } from "@/components/alert";
import { Button } from "@/components/ui/button";
import { editProfileAction } from "@/app/actions/editProfileAction";
import { editProfileSchema, EditProfileSchema } from "@/lib/zod-schemas";
import type { User } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { Voucher } from "@/components/voucherUser";
// import { useSession } from "next-auth/react";

export function UserProfile({ user }: { user: User }) {
  const formSchema = editProfileSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name as string,
      email: user.email as string,
    },
  });
  // const { update } = useSession()

  const { formState, setError } = form;

  const onSubmit = async (data: EditProfileSchema) => {
    const result = await editProfileAction(user.id, data);

    if (result?.zod_errors) {
      Object.entries(result.zod_errors).forEach(([field, value]) => {
        setError(field as keyof EditProfileSchema, {
          type: "manual",
          message: value[0] ?? value,
        });
      });
    }

    if (result?.error) {
      setError("root.global", {
        type: "manual",
        message: result.error,
      });
    }

    if (result.success) {
      toast({
        title: "Sucesso",
        description: result.message,
        variant: "success",
      });
    }

    // if (result?.user) {
    //   console.log('RESULT USERR', result?.user)
    //   update({ ...user, name: result.user.name, email: result.user.email })
    // }
  };

  return (
    <>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <h2 className="font-semibold text-gray-900 text-2xl">
            Editar perfil
          </h2>

          <Voucher validUntil={new Date("2025-09-02")} />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6"
          >
            <div className="col-span-1 md:col-span-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={formState.isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1 md:col-span-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome:</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={formState.isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1 md:col-span-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
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
                )}
              />
            </div>
            <div className="col-span-1 md:col-span-3">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
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
                )}
              />
            </div>
            {formState.errors.root?.global.message && (
              <div className="col-span-1 md:col-span-6 justify-self-end w-fit">
                <Alert
                  variant="danger"
                  content={formState.errors.root?.global.message as string}
                  title="Falha ao editar perfil."
                />
              </div>
            )}

            <div className="col-span-1 md:col-span-6 w-full flex justify-end">
              <Button
                className="mt-4"
                loading={formState.isSubmitting}
                disabled={formState.isSubmitting}
                type="submit"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
