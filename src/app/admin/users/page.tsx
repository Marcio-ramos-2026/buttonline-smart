
import { prisma } from "@/lib/prisma";
import { UsersList } from "./list";
import { Permissions } from "@/lib/types";

const AdminPage = async ({searchParams}:{  searchParams: Promise<{ page: number | undefined }>}) => {
  const filters = await searchParams;

  console.log('filters',filters)
  // If page is undefined, default to 0
  let page = filters.page ?? 0;

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
      <>
          <UsersList data={users} page={page as number} />
      </>
  )
}

export default AdminPage