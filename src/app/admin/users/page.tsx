
import { prisma } from "@/lib/prisma";
import { UsersList } from "./list";
import { Permissions } from "@/lib/types";
import {getTranslations} from 'next-intl/server';
import { Button } from "@/components/ui/button";
import { Copy, UserPlus } from "lucide-react";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

const AdminPage = async ({searchParams}:{  searchParams: Promise<{ page: string | undefined }>}) => {
  const filters = await searchParams;
  const LIMIT = 10;

  // If page is undefined, default to 0
  let page = filters.page ? parseInt(filters.page as string) : 1;
  
  // Adjust skip logic: If it's the first page, skip 0 (same as page 1 in a typical pagination system)
  const skip = page == 0 ? 0 : (page - 1) * LIMIT; // skip starts at 0 for page 1

  const userWhere = {
    role: {
      permissions: {
        some: {
          permission: {
            name: Permissions.IS_ADMIN
          }
        }
      }
    }
  }

  const users = await prisma.user.findMany({
    skip:skip,
    take:LIMIT,
    where: userWhere
  })

  const totalUsers = await prisma.user.count({
    where: userWhere
  })

  const t = await getTranslations('pages.admin.users')

  return (
      <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 id="order-history-heading" className="text-3xl font-bold tracking-tight text-gray-900">
                {t("title")}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {t("description")}
              </p>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button icon={<UserPlus />} className="cursor-pointer">Novo administrador</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label className="sr-only">
                        Link
                      </Label>
                      <Input
                        label="test"
                        name="test"
                      />
                    </div>
                    <Button type="submit" size="sm" className="px-3">
                      <span className="sr-only">Copy</span>
                      <Copy />
                    </Button>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <UsersList data={users} page={page as number} totalUsers={totalUsers} limit={LIMIT} />
      </div>
  )
}

export default AdminPage