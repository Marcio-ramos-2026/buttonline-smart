
'use client'
import { ALLOWED_PERMISSIONS } from '@/lib/permissions';
import { ColumnDef } from '@tanstack/react-table';
import { useSession } from 'next-auth/react';

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

/**
 * A function that filters the columns with `enableHiding: true`
 * and returns an object where each column is set to `false` by default (hidden).
 */
export const tablePermission = <T,>(
    columns: ColumnDef<T, any>[]
  ): Record<string, boolean> => {
    return columns.reduce((acc, col) => {
        // Only consider columns that have `enableHiding: true`
        if (col.enableHiding) {
          // Use `id` to uniquely identify the column
          const columnId = col.id;
          
          // If `id` exists, mark it as hidden (false) by default
          if (columnId) {
            acc[columnId] = false;
          }
        }
        return acc;
      }, {} as Record<string, boolean>);
  };