import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import {prisma} from '@/lib/prisma'
import type { Adapter } from 'next-auth/adapters';
import bcrypt from 'bcrypt'
import { randomUUID } from "crypto";
import { encode as defaultEncode } from "next-auth/jwt";

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

        console.log('ALOU',credentials)

        try {
          user = await prisma.user.findFirst({
            where: {
              email: credentials.email as string
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
      if (account?.provider === "credentials") {
        token.credentials = true
      }
      return token
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = randomUUID();

        if (!params.token.sub) {
          throw new Error("No user ID found in token")
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        if (!createdSession) {
          throw new Error("Failed to create session")
        }

        return sessionToken
      }
      return defaultEncode(params)
    },
  },
})

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       credentials: {
//         email: {},
//         password: {},
//       },
//       //@ts-ignore
//       authorize: async (credentials) => {
//         let user: UserType;

//         try {
//           user = await findUserByEmail(credentials.email as string);
//         } catch (e) {
//           console.log("error", e);
//           throw new Error("Erro interno");
//         }

//         if (!user) throw new Error("Usuário ou senha inválidos.");

//         if (credentials.password !== user.password) throw new Error("Usuário ou senha inválidos.");

//         return user;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
// });
