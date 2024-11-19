import NextAuth, { DefaultSession } from "next-auth"
import { Roles } from "@/lib/types"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      roleId: number
      id?: string
      name?: string | null
      email?: string | null
      image?: string | nulltring
      password?: string
    }
  }

  interface User {
    roleId: number
    password?: string
  }
}