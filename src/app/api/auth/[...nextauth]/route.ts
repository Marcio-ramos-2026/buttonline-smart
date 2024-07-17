import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { },
        password: { },
      },
      authorize: async (credentials) => {
        console.log("credential", credentials);
        const result = {
            name: 'Teste',
            email: 'email@email.com'
        }
        return result;
      },
    }),
  ],
});
