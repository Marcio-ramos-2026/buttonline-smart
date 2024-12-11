'use client'

import { Permission, tablePermission } from "@/components/permission";
import { DateFormatter, DateRelativeFormatter } from "@/components/table/date";
import { Table } from "@/components/ui/table";
import { useTableAction } from "@/hooks/useTableActions";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import type { User } from '@prisma/client'
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from 'lucide-react'
import { useTranslations } from "next-intl";
import { useMemo } from "react";


export const UsersList = ({data,page,totalUsers,limit}: {data: User[],page: number,totalUsers: number,limit:number}) => {
    const t = useTranslations('pages.admin.users')

    const columns = useMemo<ColumnDef<User>[]>(()=>{
      return [
        {
          accessorKey: "id",
          header: "ID",
          enableSorting: false,
        },
        {
          accessorKey: "name",
          header: t("columns.name"),
          enableSorting: true,
        },
        {
            accessorKey: "email",
            header: t("columns.email"),
            enableSorting: true,
        },
        {
            accessorKey: "lastAccess",
            header: t("columns.lastAccess"),
            enableSorting: false,
            cell: ({row}) => {
                return <DateRelativeFormatter date={row.original.lastAccess as Date}/>
            }
          },
        {
          accessorKey: "createdAt",
          header: t("columns.createdAt"),
          enableSorting: false,
          cell: ({row}) => {
              return <DateFormatter date={row.original.createdAt as Date} options={{
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }} />
          }
        },
        {
          accessorKey: "edit",
          header: "testa",
          enableSorting: false,
          cell: () => {
            return <Permission has={[ALLOWED_PERMISSIONS.ADMIN_USER_EDIT]}><Edit /></Permission>
          }
        },
      ];
    },[t])

    const actions = useTableAction({totalItems:totalUsers,pageIndex:page,pageSize:limit})
    // const a = tablePermission()

    return (
        <Table data={data} columns={columns} {...actions} />
    )
}