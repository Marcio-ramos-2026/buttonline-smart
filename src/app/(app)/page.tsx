"use client";

import * as React from "react";
import {
  Baseline,
  Folder,
  ImageIcon,
  Redo2,
  Undo2,
  SquareDashed,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import FabricContextProvider, { RenderCanvas } from "@/context/editor";
import { TabIcons } from "@/components/editor/icons";
import { EditableBar } from "@/components/appSideBar/editableBar/editableBar";
import { AppSidebar } from "@/components/appSideBar";
import { AddText } from "@/components/appSideBar/addText";
import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/language-selector";
import { AddImage } from "@/components/appSideBar/addImage";
import { TabShapes } from "@/components/editor/shapes";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      id: "1",
      icon: Folder,
      title: "Meus arquivos",
      content: Teste,
      active: true,
    },
    {
      id: "2",
      icon: ImageIcon,
      title: "Imagens",
      content: AddImage,
    },
    {
      id: "3",
      icon: Baseline,
      title: "Texto",
      content: AddText,
    },
    {
      id: "4",
      icon: SquareDashed,
      title: "Icones",
      content: TabIcons,
    },
    {
      id: "5",
      icon: Baseline,
      title: "Formas",
      content: TabShapes,
    },
    {
      id: "6",
      icon: Baseline,
      title: "Texto6",
      content: Teste,
    },
  ],
};

export default function Page() {
  const t = useTranslations("test");

  return (
    <FabricContextProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "350px",
          } as React.CSSProperties
        }
        className="min-h-[calc(100svh-40px)] relative"
      >
        <AppSidebar items={data.navMain} user={data.user} />
        <SidebarInset className="min-h-[calc(100svh-40px)]">
          <header className="flex shrink-0 items-center gap-2 border-b bg-background p-2 md:p-4 h-14 md:h-auto">
            <SidebarTrigger className="-ml-1 hidden md:flex" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 hidden md:flex"
            />
            <div className="flex gap-3 items-center w-full">
              <div className="flex gap-1 flex-0">
                <Undo2 className="w-5 h-5" />
                <Redo2 className="w-5 h-5" />
              </div>
              <EditableBar />
            </div>
            <div className="space-x-2 text-black ml-auto">
              <LanguageSelector />
            </div>
          </header>
          <main className="h-full">
            <RenderCanvas />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </FabricContextProvider>
  );
}

function Teste({ content }: { content: string }) {
  return <p className="text-textForefround">{content}</p>;
}
