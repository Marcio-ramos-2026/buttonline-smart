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
import { Edit, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { EditForm } from "./updateClientForm";
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
import { useRouter } from "next/navigation";
import { FiltersSection } from "@/components/filterSection";

export const ClientList = ({
  data,
  page,
  totalClients,
  limit,
}: {
  data: User[];
  page: number;
  totalClients: number;
  limit: number;
}) => {
  const t = useTranslations("pages.admin.clients");
  const tFilter = useTranslations("pages.admin.filter");

  const filtersConfig = [
    {
      key: "search",
      label: tFilter("search"),
      icon: <Search />,
      type: "input" as const,
    },
  ];


  const columns = useMemo<ColumnDef<User>[]>((): ColumnDef<User>[] => {
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
        accessorKey: "voucherTime",
        header: t("columns.voucherTime"),
        enableSorting: true,
        cell: ({ row }) => {
          return (
            <DateRelativeFormatter date={row.original.voucherTime as Date} />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: t("columns.createdAt"),
        enableSorting: true,
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
          permissions: [ALLOWED_PERMISSIONS.ADMIN_CLIENTS_EDIT],
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
                  <DialogTitle>{t("modalUpdateClient.title")}</DialogTitle>
                  <DialogDescription>
                    {t("modalUpdateClient.subTitle")}
                  </DialogDescription>
                </DialogHeader>
                <EditForm
                  name={row.original.name as string}
                  email={row.original.email as string}
                  clientId={row.original.id}
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
          permissions: [
            ALLOWED_PERMISSIONS.IS_ADMIN,
            ALLOWED_PERMISSIONS.ADMIN_CLIENTS_DELETE,
          ],
        },
        size: 20,
        cell: DeleteClient,
      },
    ];
  }, [t]);

  const actions = useTableAction({
    totalItems: totalClients,
    pageIndex: page,
    pageSize: limit,
  });

  return (
    <>
      <div className="w-fit ml-auto mb-4">
        <FiltersSection
          filtersConfig={filtersConfig}
          onApply={actions.onFiltering}
        />
      </div>
      <Table data={data} columns={columns} {...actions} />
    </>
  );
};

type DeleteClientProsp = {
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
  }>;
};

const DeleteClient = ({ row }: DeleteClientProsp) => {
  const [pending, setPending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const t = useTranslations("pages.admin.clients");
  const tToast = useTranslations("toast");
  if (row.original.email === "cardenas@cardenas.com.br") return null;

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPending(true);

    deleteAdminAction(row.original.id)
      .then((response) => {
        if (response.message) {
          toast({
            variant: "default",
            title: tToast("archived"),
            description: response.message,
          });
          router.refresh();
          return;
        }

        toast({
          variant: "danger",
          title: tToast("error"),
          description: response.error,
        });
      })
      .catch((e) => {
        toast({
          variant: "danger",
          title: tToast("error"),
          description: e.message,
        });
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
            {t("modalDeleteClient.title", { name: row.original.name })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("modalDeleteClient.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild className={`${pending ? "hidden" : ""}`}>
            <Button>{t("modalDeleteClient.cancel")}</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} asChild>
            <Button loading={pending}>
              {pending
                ? t("modalDeleteClient.archiving")
                : t("modalDeleteClient.confirm")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
