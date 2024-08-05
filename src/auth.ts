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
      authorize: async (credentials) => {
        console.log("credential", credentials);

        let user: UserType;

        try {
          user = await findUserByEmail(credentials.email as string);
        } catch (e) {
          console.log("error", e);
          throw new Error("Erro interno");
        }

        console.log("user", user);

        if (!user) throw new Error("Usuário ou senha inválidos.");

        if (credentials.password !== user.password)
          throw new Error("Usuário ou senha inválidos.");

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
});
