import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import {prisma} from '@/lib/prisma'
import type { Adapter } from 'next-auth/adapters';
import bcrypt from 'bcrypt'
import { randomUUID } from "crypto";
import { encode } from "next-auth/jwt";

const adapter = PrismaAdapter(prisma) as Adapter

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: adapter,
  session: {
    strategy: "jwt", // Ensures the session uses database strategy
  },
    providers: [
    Credentials({
      credentials: {
        email: {type:'string'},
        password: {type:'string'},
      },
      authorize: async (credentials) => {
        let user;

        try {
          user = await prisma.user.findFirst({
            where: {
              email: credentials.email as string
            },
            include: {
              role: {
                include: {
                  permissions: true
                }
              }
            }
          });
        } catch (e) {
          console.log("error", e);
          throw new Error("Erro interno");
        }
        if (!user) throw new Error("Usuário ou senha inválidos.");

        const isSamePassword = await bcrypt.compare(credentials.password as string,user.password as string)
        if(!isSamePassword) throw new Error("Usuário ou senha inválidos.");

        return user as User;
      },
    }),
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if(user){
        token.id = user.id
        //@ts-ignore
        token.role = user.role.name as string
        //@ts-ignore
        token.permissions = user.role.permissions.map((permission) => permission.name)
      }

      if (account?.provider === "credentials") {
        token.credentials = true

        const sessionToken = randomUUID();
        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: token.id as string,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        token.sub = createdSession?.sessionToken
      }
      
      return token
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        console.log('its credentials')
        if (!params.token.sub) {
          throw new Error("No user ID found in token")
        }

        try {
          await adapter?.updateSession?.({
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sessionToken: params.token.sub
          })
        }catch(e){
          //para suprimir o erro ao att uma sessão inexistente
        }
        
      }
      return encode(params)
    },
  },
})
