import { prisma } from "@/lib/prisma";
import { EditorProvider } from "./editor";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/permission-server";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";

export default async function Page({
  searchParams,
}: {
  searchParams: { id: string, admin_view: boolean };
}) {
  const session = await auth();
  const is_admin = await hasPermission([ALLOWED_PERMISSIONS.IS_ADMIN]) 

    let activeFilter = true;
    if(is_admin && searchParams.admin_view){ 
      activeFilter = false;
    }


  const allowed_models = await prisma.editor_canvas.findMany({
    where: {
      active: activeFilter,
    },
  });

  if (!allowed_models) {
    return <h1>nada</h1>;
  }

  const selectedModel = allowed_models.find(
    (model) => model.id == parseInt(searchParams.id)
  );

  // const canvas = allowed_models[0];
  // const t = await getTranslations("pages.editor.sideBar");

  return (
    <>
      <EditorProvider
        allowed_models={allowed_models}
        model={selectedModel}
        //@ts-ignore
        user={session?.user}
      />
    </>
  );
}
