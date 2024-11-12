import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: string
      id?: string
      name?: string | null
      email?: string | null
      image?: string | nulltring
      password?: string
    }
  }

  interface User {
    role: string // Include role in the User type
    password?: string
  }
}