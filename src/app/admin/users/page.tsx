import { prisma } from "@/lib/prisma";
import { UsersList } from "./list";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import { getTranslations } from "next-intl/server";
import { ProfileForm } from "./create-admin";
import { Prisma } from "@prisma/client";
import { hasPermission } from "@/lib/permission-server";
import { DeniedPermission } from "@/components/deniedPermission";

type ParamsType = {
  page: string | undefined;
  name: string | undefined;
  email: string | undefined;
  search: string | undefined;
};

const AdminPage = async ({
  searchParams,
}: {
  searchParams: Promise<ParamsType>;
}) => {
  const filters = await searchParams;
  const LIMIT = 10;

  if (!(await hasPermission([ALLOWED_PERMISSIONS.ADMIN_USERS]))) {
    return <DeniedPermission />;
  }

  // If page is undefined, default to 0
  let page = filters.page ? parseInt(filters.page as string) : 1;

  let orderByObj;
  let filterConditions: Record<string, any>[] = [];
  let userWhere: Prisma.UserWhereInput = {
    role: {
      permissions: {
        some: {
          permission: {
            name: ALLOWED_PERMISSIONS.IS_ADMIN,
          },
        },
      },
    },
  };

  Object.keys(filters).forEach((key) => {
    const splitKey = key.split("_");
    const columnName = splitKey[1];
    const value = filters[key as keyof ParamsType];

    if (key.includes("sort") && value) {
      orderByObj = {
        [columnName]: value,
      };
    }
    if (key.includes("filter") && value) {
      if (columnName === "search") {
        filterConditions.push(
          { name: { contains: value } },
          { email: { contains: value } }
        );
      } else {
        filterConditions.push({
          [columnName]: {
            contains: value,
          },
        });
      }
    }
  });

  if (filterConditions.length > 0) {
    userWhere = {
      ...userWhere,
      OR: filterConditions,
    };
  }

  // Adjust skip logic: If it's the first page, skip 0 (same as page 1 in a typical pagination system)
  const skip = page == 0 ? 0 : (page - 1) * LIMIT; // skip starts at 0 for page

  const users = await prisma.user.findMany({
    skip: skip,
    take: LIMIT,
    where: userWhere,
    orderBy: orderByObj,
  });

  const totalUsers = await prisma.user.count({
    where: userWhere,
  });

  const t = await getTranslations("pages.admin.users");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1
            id="order-history-heading"
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{t("description")}</p>
        </div>
        <div>
          <ProfileForm />
        </div>
      </div>
      <UsersList
        data={users}
        page={page as number}
        totalUsers={totalUsers}
        limit={LIMIT}
      />
    </div>
  );
};

export default AdminPage;
