
import { prisma } from "@/lib/prisma";
import { UsersList } from "./list";
import { Permissions } from "@/lib/types";
import { Suspense } from "react";

const AdminPage = async ({searchParams}:{  searchParams: Promise<{ page: number | undefined }>}) => {
  const filters = await searchParams;

  // If page is undefined, default to 0
  let page = filters.page ?? 1;

  // Adjust skip logic: If it's the first page, skip 0 (same as page 1 in a typical pagination system)
  const skip = page == 0 ? 0 : (page - 1) * 10; // skip starts at 0 for page 1
  const take = 10; // Limit results to 10 per page

  const users = await prisma.user.findMany({
    skip:skip,
    take:take,
    where: {
      role: {
        permissions: {
          some: {
            permission: {
              name: Permissions.IS_ADMIN
            }
          }
        }
      }
    },
  })

  return (
      <div>
            <div className="max-w-xl mb-8">
              <h1 id="order-history-heading" className="text-3xl font-bold tracking-tight text-gray-900">
                Usuários administradores
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Esses usuários tem permissões especiais de acesso a plataforma
              </p>
            </div>
            <UsersList data={users} page={page+1 as number} />
      </div>
  )
}

export default AdminPage