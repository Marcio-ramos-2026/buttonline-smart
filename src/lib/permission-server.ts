'use server'

import { auth } from "@/auth";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";

export const hasPermission = async (permissions: ALLOWED_PERMISSIONS[]) => {
    const session = await auth();
    if(!session) return false
  
    const hasPermission = session.permissions.find((p) => permissions?.includes(p as ALLOWED_PERMISSIONS))
    if(!hasPermission) return false
  
    return true
  }