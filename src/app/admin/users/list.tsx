'use client'

import { DateFormatter, DateRelativeFormatter } from "@/components/table/date";
import { Table } from "@/components/ui/table";
import { useTableAction } from "@/hooks/useTableActions";
import type { User } from '@prisma/client'
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from 'lucide-react'


const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Nome",
      enableSorting: true,
    },
    {
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
    },
    {
        accessorKey: "lastAccess",
        header: "Último acesso",
        enableSorting: false,
        cell: ({row}) => {
            return <DateRelativeFormatter date={row.original.lastAccess as Date}/>
        }
      },
    {
      accessorKey: "createdAt",
      header: "Criado em",
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
      header: "",
      enableSorting: false,
      cell: () => {
        return <Edit />
      }
    },
  ];

export const UsersList = ({data,page}: {data: User[],page: number}) => {
    const actions = useTableAction({totalItems:1,pageIndex:page})

    return (
        <Table data={data} columns={columns} {...actions} totalData={data.length} />
    )
}