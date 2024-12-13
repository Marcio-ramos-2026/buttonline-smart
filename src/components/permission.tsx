
'use client'
import { ALLOWED_PERMISSIONS } from '@/lib/permissions';
import { getSession, useSession } from 'next-auth/react';

type IPermission = {
    children: React.ReactNode
    has: ALLOWED_PERMISSIONS[]
    route?: string
}

/**
 * A component to conditionally render children based on permissions.
 *
 * @param children - The content to render if the user has permission.
 * @param permishassion - An array of permission strings required to render the children.
 */
export const Permission = ({children, has}: IPermission) => {
    const { data: session } = useSession(); // Get session from NextAuth hook

    const hasPermission = session?.permissions.find((p) => has?.includes(p as ALLOWED_PERMISSIONS))
    if(!hasPermission) return null
    
    return children
}