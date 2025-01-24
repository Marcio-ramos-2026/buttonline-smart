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
  UserRoundCog,
  Eclipse,
  PaintBucket,
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
import type { editor_canvas } from "@prisma/client";
import { Permission } from "@/components/permission";
import Link from "next/link";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import type { User as UserType } from "@prisma/client";
import { useEditorContext } from "@/context/editor";
import { useState } from "react";
import { Tooltip } from "@/components/tooltip/tooltip";
import CanvasHistory from "@/lib/fabricHistory";
import { NavUser } from "@/components/nav-user";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { ColorPicker } from "@/components/colorPicker";

type EditorType = {
  model?: editor_canvas;
  allowed_models: editor_canvas[];
  user: UserType;
};

type EditorProps = {
  user: UserType;
};

export const EditorProvider = ({ model, allowed_models, user }: EditorType) => {
  return (
    <FabricContextProvider model={model} allowed_models={allowed_models}>
      <Editor user={user} />
    </FabricContextProvider>
  );
};

export function Editor({ user }: EditorProps) {
  const t = useTranslations("pages.editor.sideBar");
  const { canvas, history } = useEditorContext();

  const data = {
    navMain: [
      // {
      //   id: "1",
      //   icon: Folder,
      //   title: t("tabs.file.label"),
      //   content: Teste,
      //   active: true,
      // },
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
      className="min-h-[calc(100svh-40px)] relative"
    >
      <AppSidebar items={data.navMain} user={user} />
      <SidebarInset className="min-h-[calc(100svh-40px)] overflow-hidden">
        <header className="flex shrink-0 items-center gap-3 border-b bg-background px-2 md:px-4 py-1.5 md:py-3 w-full h-14 md:h-auto overflow-x-auto scrollBar">
          {/* <SidebarTrigger className="-ml-1 hidden md:flex" /> */}
          {/* <Separator
              orientation="vertical"
              className="mr-2 h-8 bg-gray-600/50 hidden md:flex"
            /> */}
          <div className="flex gap-2.5 md:gap-4 items-center justify-between h-full md:w-full">
            <div className="flex gap-1.5 md:gap-3 flex-0 h-full">
              <button
                onClick={() => history("undo")}
                className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
              >
                <Undo2 />
              </button>
              <button
                onClick={() => history("redo")}
                className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
              >
                <Redo2 />
              </button>
              <ClipButton />
              <ChangeButtonCollor />
              {/* <ChangeModelDropdown /> */}
              <EditableBar />
            </div>
            <div className="flex gap-1.5 md:gap-3 items-center">
              <Permission has={[ALLOWED_PERMISSIONS.IS_ADMIN]}>
                <Link href={"/admin/users"}>
                  <Button icon={<UserRoundCog />}>
                    {/* {t("notifications")} */}
                    Admin
                  </Button>
                </Link>
              </Permission>
              <div className="text-black ml-auto">
                <LanguageSelector />
              </div>
              <div className="block md:hidden">
                <NavUser user={user} />
              </div>
            </div>
          </div>
        </header>
        <section className="w-full h-full">
          <RenderCanvas />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

const ClipButton = () => {
  const { clipMask } = useEditorContext();
  const [isClipActive, setIsClipActive] = useState(false);
  const t = useTranslations("pages.editor.sideBar");

  const handleToggleClip = () => {
    const newClipState = !isClipActive;
    setIsClipActive(newClipState);
    clipMask(newClipState);
  };

  return (
    <Tooltip content={t("clip")}>
      <Button
        className="w-[76px]"
        variant={isClipActive ? "solid" : "outline"}
        onClick={handleToggleClip}
        icon={<Eclipse />}
      ></Button>
    </Tooltip>
  );
};

const ChangeButtonCollor = () => {
  const { changeButtonColor } = useEditorContext();
  const [color, setColor] = useState<string | null>("#fff");
  const t = useTranslations("pages.editor.sideBar");

  const handleChangeColor = (e: string) => {
    setColor(e);
    changeButtonColor(e);
  };

  return (
    <DropdownMenu>
      <Tooltip content={t("buttonBgColor")}>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-[76px]"
            variant={"outline"}
            icon={<PaintBucket />}
          ></Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
        <div className="flex justify-between w-full">
          <span className="text-xs">{t("buttonBgColor")}</span>
        </div>
        <ColorPicker
          value={color as string}
          onChange={handleChangeColor}
          className="border-gray-300"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ChangeModelDropdown = () => {
  const { models } = useEditorContext();
  const t = useTranslations("pages.editor.sideBar");
  const [pending, setPending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  function handleChangeModel(id: number): void {
    //setOpenDialog(true);
    // window.location.href = `?id=${model.id}`;
  }

  const handleDelete = () => {};

  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {/* <ArrowDown className="h-4 w-4" /> */}

              <span className="font-medium">
                {"t(selectedLanguage?.locale)"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Selecione um modelo:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {models.map((model) => {
                return (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => handleChangeModel(model.id)}
                  >
                    <AlertDialogTrigger>
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                      </div>
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent
          onEscapeKeyDown={(e) => (pending ? e.preventDefault() : null)}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>title</AlertDialogTitle>
            <AlertDialogDescription>desc</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild className={`${pending ? "hidden" : ""}`}>
              <Button>cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} asChild>
              <Button>aaaaaaaaa</Button>
              {/* <Button loading={pending}>
              {pending
                ? t("modalDeleteClient.archiving")
                : t("modalDeleteClient.confirm")}
            </Button> */}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* <Test
       pending={pending}
       setPending={setPending}
       openDialog={openDialog}
       setOpenDialog={setOpenDialog}
      /> */}
    </>
  );
};

// const Test = ({ pending, setPending, openDialog, setOpenDialog }) => {
//   // const [pending, setPending] = useState(false);
//   // const [openDialog, setOpenDialog] = useState(false);

//   const handleDelete = () => {};

//   return (
//     <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
//       <AlertDialogTrigger asChild>
//         <Button
//           variant={"link"}
//           className="cursor-pointer"
//           onClick={() => setOpenDialog(true)}
//         >
//           trigger
//         </Button>
//       </AlertDialogTrigger>

//       <AlertDialogContent
//         onEscapeKeyDown={(e) => (pending ? e.preventDefault() : null)}
//       >
//         <AlertDialogHeader>
//           <AlertDialogTitle>title</AlertDialogTitle>
//           <AlertDialogDescription>desc</AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel asChild className={`${pending ? "hidden" : ""}`}>
//             <Button>cancel</Button>
//           </AlertDialogCancel>
//           <AlertDialogAction onClick={handleDelete} asChild>
//             <Button>aaaaaaaaa</Button>
//             {/* <Button loading={pending}>
//               {pending
//                 ? t("modalDeleteClient.archiving")
//                 : t("modalDeleteClient.confirm")}
//             </Button> */}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };
