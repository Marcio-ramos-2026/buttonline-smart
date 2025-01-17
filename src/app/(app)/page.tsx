import { prisma } from "@/lib/prisma";
import { EditorProvider } from "./editor";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";

export default async function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const session = await auth();

  const allowed_models = await prisma.editor_canvas.findMany({
    where: {
      active: true,
    },
  });

  if (!allowed_models) {
    return <h1>nada</h1>;
  }

  const selectedModel = allowed_models.find(
    (model) => model.id == parseInt(searchParams.id)
  );

  console.log('aaaaaaaaaaa', selectedModel)

  const canvas = allowed_models[0];
  const t = await getTranslations("pages.editor.sideBar");

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
