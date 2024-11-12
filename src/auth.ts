import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter"
import {prisma} from '@/lib/prisma'
import type { Adapter } from 'next-auth/adapters';
import bcrypt from 'bcrypt'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "database", // Ensures the session uses database strategy
  },
    providers: [
    Credentials({
      credentials: {
        email: {type:'string'},
        password: {type:'string'},
      },
      authorize: async (credentials) => {
        let user: User;

        try {
          user = await findUserByEmail(credentials.email as string);
        } catch (e) {
          console.log("error", e);
          throw new Error("Erro interno");
        }

        if (!user) throw new Error("Usuário ou senha inválidos.");

        const isSamePassword = await bcrypt.compare(credentials.password as string,process.env.PASSWORD_HASH  as string)
        if(!isSamePassword) throw new Error("Usuário ou senha inválidos.");

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role
      return session
    }
  }
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
