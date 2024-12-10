'use client'

import { registerAction } from "@/app/actions/register"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputPassword } from "@/components/ui/inputPassword"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, { message: "O nome de usuário é obrigatório" }),
  email: z.string().min(1, { message: "O email é obrigatório" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

export type UserType = z.infer<typeof formSchema>;


export const RegisterForm = () => {
    const formRef = useRef<HTMLFormElement>(null)
    // const [state, formAction] = useFormState(registerAction, initialState);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: UserType) => {
      // const formData = new FormData()
      // Object.keys(data).forEach(key => {
      //   formData.append(key, data[key]);
      // });

      const result = await registerAction(data)
      // console.log('result',result)
    }

  

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome:</FormLabel>
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
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Senha:</FormLabel>
                <FormControl>
                  <InputPassword {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
              <SubmitButton />
          </div>

        </form>
        </Form>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return <Button full className='mt-4' loading={pending} disabled={pending} type="submit">Cadastrar</Button>
}