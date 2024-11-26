'use client'

import { Table } from "@/components/ui/table"
import { useTableAction } from "@/hooks/useTableActions";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from 'lucide-react'

interface user {
    id: string
    name: string
    email: string
    lastAccess?: Date
    createdAt: Date
}

const columns: ColumnDef<user>[] = [
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
      },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      enableSorting: false,
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

  const data = [
    {id:'1',name:'Vinicius Rangel',email:'vinicius.rangel@ad4pixels.com.br',createdAt: new Date()},
    {id:'2',name:'Marcola Goda',email:'marcola.goda@ad4pixels.com.br',createdAt: new Date(), lastAccess: new Date()},
    {id:'3',name:'Gordo Bonin',email:'gordo.bonin@ad4pixels.com.br',createdAt: new Date()}
  ]
  

const AdminPage = () => {
    const actions = useTableAction();

    return (
        <div>
            <h1>olar</h1>
            <Table data={data} columns={columns} {...actions} totalData={10} />
        </div>
    )
}

export default AdminPage