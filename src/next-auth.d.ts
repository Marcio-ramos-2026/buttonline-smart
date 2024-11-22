import NextAuth, { DefaultSession, } from "next-auth"
import { Roles } from "@/lib/types"
import { JWT } from "next-auth/jwt"


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


declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    sub?: string
  }
}