import { prisma } from "@/lib/prisma";
import { Editor } from "./editor";
import { TabIcons } from "@/components/editor/icons";
import { AddImage } from "@/components/editor/images/addImage";
import { TabShapes } from "@/components/editor/shapes";
import { AddText } from "@/components/editor/text/addText";
import { Folder, ImageIcon, Baseline, SquareDashed, Pentagon } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Page() {

  const canvas = await prisma.editor_canvas.findFirst({
    where: {
      id: 1
    }
  })

  if(!canvas) return <h1>nao achou nenhum</h1>

  const t = await getTranslations("pages.editor.sideBar");

  const data = {
    user: {
      name: "Usuário Teste",
      email: "usuário@teste.com",
    },
    navMain: [
      {
        id: "1",
        icon: Folder,
        title: t("tabs.file.label"),
        content: Teste,
        active: true,
      },
      {
        id: "2",
        icon: ImageIcon,
        title: t("tabs.image.label"),
        content: AddImage,
      },
      {
        id: "3",
        icon: Baseline,
        title: t("tabs.text.label"),
        content: AddText,
      },
      {
        id: "4",
        icon: SquareDashed,
        title: t("tabs.icon.label"),
        content: TabIcons,
      },
      {
        id: "5",
        icon: Pentagon,
        title: t("tabs.shape.label"),
        content: TabShapes,
      },
    ],
  };

  return (
      <Editor model={canvas} />
  )
}


const Teste = () => <h1>test</h1>