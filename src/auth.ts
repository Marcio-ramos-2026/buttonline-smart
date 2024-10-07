import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      id: number;
    };
  }
}

type UserType = {
  email: string;
  password: string;
  name: string;
  id: number;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      //@ts-ignore
      authorize: async (credentials) => {
        let user: UserType;

        try {
          user = await findUserByEmail(credentials.email as string);
        } catch (e) {
          console.log("error", e);
          throw new Error("Erro interno");
        }

        if (!user) throw new Error("Usuário ou senha inválidos.");

        if (credentials.password !== user.password) throw new Error("Usuário ou senha inválidos.");

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
