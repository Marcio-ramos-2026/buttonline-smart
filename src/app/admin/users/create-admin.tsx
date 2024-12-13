"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { createAdminAction } from "@/app/actions/admin/create-admin";

const formSchema = z.object({
  name: z.string().min(1, { message: "O nome de usuário é obrigatório" }),
  email: z.string().min(1, { message: "A senha é obrigatória" }),
});

const initialState = {
  message: "",
};

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [state, formAction] = useFormState(createAdminAction, initialState);


  console.log('ss', state)

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do usuario:</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Email do usuário:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full">
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      className="ml-auto block"
      loading={pending}
      disabled={pending}
      type="submit"
    >
      Criar
    </Button>
  );
};
