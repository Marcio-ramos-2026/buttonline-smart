"use client";

import { DateFormatter, DateRelativeFormatter } from "@/components/table/date";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table } from "@/components/ui/table";
import { useTableAction } from "@/hooks/useTableActions";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import type { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit,Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { EditForm } from "./updateUserForm";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger,AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteAdminAction } from "@/app/actions/admin/delete-admin";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const UsersList = ({
  data,
  page,
  totalUsers,
  limit,
}: {
  data: User[];
  page: number;
  totalUsers: number;
  limit: number;
}) => {
  const t = useTranslations("pages.admin.users");

  const columns = useMemo<ColumnDef<User>[]>(() => {
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
        cell: ({ row }) => {
          return (
            <DateRelativeFormatter date={row.original.lastAccess as Date} />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: t("columns.createdAt"),
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <DateFormatter
              date={row.original.createdAt as Date}
              options={{
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }}
            />
          );
        },
      },
      {
        accessorKey: "edit",
        header: "",
        enableSorting: false,
        meta: {
          permissions: [ALLOWED_PERMISSIONS.ADMIN_USER_EDIT]
        },
        size: 20,
        cell: ({ row }) => {
          if(row.original.email === "cardenas@cardenas.com.br") return null;

          return (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"link"}
                  icon={<Edit />}
                  className="cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("modalUpdateUser.title")}</DialogTitle>
                  <DialogDescription>
                    {t("modalUpdateUser.subTitle")}
                  </DialogDescription>
                </DialogHeader>
                <EditForm
                  name={row.original.name as string}
                  email={row.original.email as string}
                  userId={row.original.id}
                  roleId={row.original.roleId as number}
                />
              </DialogContent>
            </Dialog>
          );
        },
      },
      {
        accessorKey: "delete",
        header: "",
        enableSorting: false,
        meta: {
          permissions: [ALLOWED_PERMISSIONS.IS_ADMIN]
        },
        size: 20,
        cell: ({ row }) => {
          const router = useRouter();

          const { toast } = useToast()
          const [pending, setPending] = useState(false)
          if(row.original.email === "cardenas@cardenas.com.br") return null;

          return (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"link"}
                  icon={<Trash2 />}
                  className="cursor-pointer"
                />
              </AlertDialogTrigger>
              <AlertDialogContent onEscapeKeyDown={(e)=>pending ? e.preventDefault() : null}>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("modalDeleteUser.title",{name: row.original.name})}</AlertDialogTitle>
                  <AlertDialogDescription>
                  {t("modalDeleteUser.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild className={`${pending ? 'hidden' : ''}`}>
                    <Button>{t("modalDeleteUser.cancel")}</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={(e)=>{
                    e.preventDefault()
                    setPending(true)

                    deleteAdminAction(row.original.id).then((response)=>{
                      if(response.message) {
                        toast({
                          variant: "default",
                          title: "Usuário criado com sucesso",
                          description: `${row.original.name} agora é um administrador`
                        }) 
                        router.refresh()
                        return
                      }

                      toast({
                        variant: "destructive",
                        title: "Houve algum erro",
                        description: response.error
                      })
                    }).catch((e)=>{
                      toast({
                        variant: "destructive",
                        title: "Houve algum erro",
                        description: e.message
                      })
                    }).finally(()=>setPending(false))
                  }}
                  asChild>
                    <Button loading={pending}>{pending ? t('modalDeleteUser.arquiving') :t("modalDeleteUser.confirm")}</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        },
      },
    ];
  }, [t]);

  const actions = useTableAction({
    totalItems: totalUsers,
    pageIndex: page,
    pageSize: limit,
  });

  return <Table data={data} columns={columns} {...actions} />;
};
