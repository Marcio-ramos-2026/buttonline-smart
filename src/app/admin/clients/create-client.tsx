"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { CreateAdminType, createAdminSchema } from "@/lib/zod-schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Permission } from "@/components/permission";
import { UserPlus } from "lucide-react";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { createClientAction } from "@/app/actions/admin/create-client";

export function CreateClient() {
  const tDialog = useTranslations("pages.admin.clients");
  const t = useTranslations("pages.admin.clients.modalCreateClient");
  const tForm = useTranslations("pages.generalZodErrors");
  const tToast = useTranslations("toast");
  const [openDialog, setOpenDialog] = useState(false);

  const schema = createAdminSchema(tForm);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { formState, setError } = form;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const onSubmit = async (data: CreateAdminType) => {
    const result = await createClientAction(data);
    if (result.zod_errors) {
      Object.entries(result.zod_errors).forEach(([field, value]) => {
        setError(field as keyof CreateAdminType, {
          type: "manual",
          message: value[0] ?? value,
        });
      });
    }

    if (result.error) {
      setError("root.global", {
        type: "manual",
        message: result.error,
      });
    }

    if (result.success) {
      toast({
        title: tToast("success"),
        description: result.message,
      });
      handleCloseDialog();
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <Permission
        has={[
          ALLOWED_PERMISSIONS.IS_ADMIN,
          ALLOWED_PERMISSIONS.ADMIN_CLIENTS_CREATE,
        ]}
      >
        <DialogTrigger asChild>
          <Button
            icon={<UserPlus />}
            className="cursor-pointer"
            onClick={handleOpenDialog}
          >
            {tDialog("modalCreateAdmin.button")}
          </Button>
        </DialogTrigger>
      </Permission>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tDialog("modalCreateAdmin.title")}</DialogTitle>
          <DialogDescription>
            {tDialog("modalCreateAdmin.subTitle")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labelName")}</FormLabel>
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
                  <FormLabel>{t("labelEmail")}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={formState.isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                loading={formState.isSubmitting}
                disabled={formState.isSubmitting}
                type="submit"
              >
                {t("submit")}
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
                <div>{formState.errors.root?.global.message}</div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
