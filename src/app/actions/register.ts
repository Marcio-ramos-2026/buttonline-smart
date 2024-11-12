"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from 'bcrypt'

const schema = z.object({
  name: z.string({required_error: 'Name required'}),  
  email: z
    .string({ message: "Email obrigatório." })
    .email({ message: "Email inválido." }),
  password: z.string().trim().min(1, { message: "Senha é obrigatória." }),
});

export async function registerAction(prevState: any, formData: FormData) {  
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };


  const validatedFields = schema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const pass = await bcrypt.hash(rawFormData.password,10)
    await prisma.user.create({
      data: {
        name: rawFormData.name,
        email:  rawFormData.email,
        password: pass
      }
    })
    return {
      message: "Usurário criado com sucesso"
    }  
  }catch(e){
    console.log('Error register action',e)
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch(e.code){
          case 'P2002':
            if (e.meta && e.meta?.target === 'users_email_key') {
              return {error:'Este e-mail já está em uso.'};
            }
          break; 
          default:
            return {error:'Erro ao criar usuário, por favor contate o suporte'}
        }
    }

    return {
      error: 'Erro ao criar usuário, por favor contate o suporte'
    }
  }

  
}
