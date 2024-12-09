"use client";

import * as React from "react";
import {
  Baseline,
  Folder,
  ImageIcon,
  Redo2,
  Undo2,
  SquareDashed,
  Pentagon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import FabricContextProvider, { RenderCanvas } from "@/context/editor";
import { TabIcons } from "@/components/editor/icons";
import { EditableBar } from "@/components/editor/editableBar";
import { AppSidebar } from "@/components/appSideBar";
import { AddText } from "@/components/editor/text/addText";
import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/language-selector";
import { AddImage } from "@/components/editor/images/addImage";
import { TabShapes } from "@/components/editor/shapes";


export default function Page() {
  const t = useTranslations("pages.editor.sideBar");

  const data = {
    user: {
      name: "Usuário Teste",
      email: "usuário@teste.com",
    },
    navMain: [
      {
        id: "1",
        icon: Folder,
        title: t('tabs.file.label'),
        content: Teste,
        active: true,
      },
      {
        id: "2",
        icon: ImageIcon,
        title: t('tabs.image.label'),
        content: AddImage,
      },
      {
        id: "3",
        icon: Baseline,
        title:t('tabs.text.label'),
        content: AddText,
      },
      {
        id: "4",
        icon: SquareDashed,
        title: t('tabs.icon.label'),
        content: TabIcons,
      },
      {
        id: "5",
        icon: Pentagon,
        title: t('tabs.shape.label'),
        content: TabShapes,
      },
    ],
  };
  

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
