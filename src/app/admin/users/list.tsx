"use client";

import { Permission, tablePermission } from "@/components/permission";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Table } from "@/components/ui/table";
import { useTableAction } from "@/hooks/useTableActions";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import type { User } from '@prisma/client'
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

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
        permission: ALLOWED_PERMISSIONS.EDITOR_VIEW
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
        header: "asdasda",
        enableSorting: false,
        cell: ({ row }) => {
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
                  <DialogTitle>Criar um Administrador</DialogTitle>
                  <DialogDescription>
                    Este usuário possuira todos os direitos de um administrador.
                  </DialogDescription>
                </DialogHeader>
                <EditForm
                  name={row.original.name as string}
                  email={row.original.email as string}
                  userId={row.original.id as string}
                  roleId={row.original.roleId as number}
                />
              </DialogContent>
            </Dialog>
            
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

const schema = z.object({
  name: z.string().min(1, { message: "O nome de usuário é obrigatório" }),
  email: z.string().email().min(1, { message: "A senha é obrigatória" }),
});

export type AdminType = z.infer<typeof schema>;

export function EditForm({
  name,
  email,
  userId,
  roleId,
}: {
  name: string;
  email: string;
  userId: String;
  roleId: number;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name,
      email: email,
    },
  });

  const { formState, setError } = form;

  const onSubmit = async (data: AdminType) => {
    console.log("d", data);

    // const result = await createAdminAction(data);
    // if (result.zod_errors) {
    //   Object.entries(result.zod_errors).forEach(([field, value]) => {
    //     setError(field as keyof AdminType, {
    //       type: "manual",
    //       message: value[0] ?? value,
    //     });
    //   });
    // }
    // if (result.error) {
    //   setError("root.global", {
    //     type: "manual",
    //     message: result.error,
    //   });
    // }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do usuario:</FormLabel>
              <FormControl>
                <Input {...field} disabled={formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email do usuário:</FormLabel>
              <FormControl>
                <Input {...field} disabled={formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full">
          <Button
            className="ml-auto block"
            loading={formState.isSubmitting}
            disabled={formState.isSubmitting}
            type="submit"
          >
            Criar
          </Button>
        </div>

        {formState.errors.root?.global.message && (
          <div
            className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>{formState.errors.root?.global.message}</div>
          </div>
        )}
      </form>
    </Form>
  );
}
