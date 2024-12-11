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
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });

    const {formState, setError} = form

    const onSubmit = async (data: UserType) => {

      const result = await registerAction(data)
      if(result.zod_errors){
        Object.entries(result.zod_errors).forEach(([field,value]) => {
          setError(field as keyof UserType,{
            type: 'manual',
            message: value[0] ?? value
          })
        })
      }

      if(result.error) {
        setError("root.global",{
          type: 'manual',
          message: result.error
        })
      }

      // result.message - SUCESSO

      console.log('result',result)
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
                  <Input {...field}  disabled={formState.isSubmitting} />
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
                <FormLabel>Senha:</FormLabel>
                <FormControl>
                  <InputPassword {...field} disabled={formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            {formState.errors.root?.global.message &&
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">Danger alert!</span> {formState.errors.root?.global.message}
                </div>
              </div>
            }
          <Button full className='mt-4' loading={formState.isSubmitting} disabled={formState.isSubmitting} type="submit">Cadastrar</Button>

        </form>
      </Form>
    )
}