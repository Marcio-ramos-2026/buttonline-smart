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
import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { EditForm } from "./updateUserForm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAdminAction } from "@/app/actions/admin/delete-admin";
import { toast } from "@/hooks/use-toast";

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
          permissions: [ALLOWED_PERMISSIONS.ADMIN_USER_EDIT],
        },
        size: 20,
        cell: ({ row }) => {
          if (row.original.email === "cardenas@cardenas.com.br") return null;

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
          permissions: [ALLOWED_PERMISSIONS.IS_ADMIN],
        },
        size: 20,
        cell: DeleteUser
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

type DeleteUserProsp = {
  row: Row<{
    email: string | null;
    id: number;
    image: string | null;
    name: string | null;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
    lastAccess: Date | null;
    deletedAt: Date | null;
    roleId: number;
    password: string | null;
}>
}


const DeleteUser = ({ row }: DeleteUserProsp) => {
  const [pending, setPending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const t = useTranslations("pages.admin.users");
  if (row.original.email === "cardenas@cardenas.com.br") return null;

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPending(true);

    deleteAdminAction(row.original.id)
      .then((s) => {
        console.log("sUCESS", s);
        toast({
          title: 'Sucesso',
          description: s.message
        })
        setOpenDialog(false)
      })
      .catch((e) => {
        console.log("ERRO", e);
      })
      .finally(() => setPending(false));
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"link"}
          icon={<Trash2 />}
          className="cursor-pointer"
          onClick={() => setOpenDialog(true)}
        />
      </AlertDialogTrigger>
      <AlertDialogContent
        onEscapeKeyDown={(e) => (pending ? e.preventDefault() : null)}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("modalDeleteUser.title", { name: row.original.name })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("modalDeleteUser.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            asChild
            className={`${pending ? "hidden" : ""}`}
          >
            <Button>{t("modalDeleteUser.cancel")}</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            asChild
          >
            <Button loading={pending}>
              {pending
                ? t("modalDeleteUser.arquiving")
                : t("modalDeleteUser.confirm")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}