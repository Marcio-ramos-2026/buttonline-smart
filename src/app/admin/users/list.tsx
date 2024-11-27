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

  const dataTeste = [
    {id:'1',name:'Vinicius Rangel',email:'vinicius.rangel@ad4pixels.com.br',createdAt: new Date()},
    {id:'2',name:'Marcola Goda',email:'marcola.goda@ad4pixels.com.br',createdAt: new Date(), lastAccess: new Date()},
    {id:'3',name:'Gordo Bonin',email:'gordo.bonin@ad4pixels.com.br',createdAt: new Date()}
  ]

export const UsersList = ({data,page}: {data: User[],page: number}) => {
    const actions = useTableAction(10,page);

    console.log('actions',actions)

    return (
        <Table data={dataTeste as User[]} columns={columns} {...actions} totalData={100} />
    )
}