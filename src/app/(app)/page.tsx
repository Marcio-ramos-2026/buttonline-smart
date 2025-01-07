import { prisma } from "@/lib/prisma";
import { Editor } from "./editor";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  const allowed_models = await prisma.editor_canvas.findMany({
    where: {
      active: true,
    },
  });

  if (!allowed_models) {
    return <h1>nada</h1>;
  }

  const canvas = allowed_models[0];
  const t = await getTranslations("pages.editor.sideBar");

  return (
    <>
      <Editor
        allowed_models={allowed_models}
        model={allowed_models[0]}
        //@ts-ignore
        user={session?.user}
      />
    </>
  );
}
