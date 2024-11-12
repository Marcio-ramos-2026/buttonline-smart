"use client";

import * as React from "react";
import {
  Baseline,
  Bell,
  Folder,
  ImageIcon,
  Redo2,
  Undo2,
  X,
  SquareDashed,
  Search,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import FabricContextProvider, {
  RenderCanvas,
  useEditorContext,
} from "@/context/editor";
import * as fabric from "fabric";
import { TabIcons } from "@/components/editor/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { NavUser } from "@/components/navbar/userSection";

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
      content: Teste,
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
      title: "Texto5",
      content: Teste,
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
        <AppSidebar />
        <SidebarInset className="min-h-[calc(100svh-40px)]">
          <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
            <SidebarTrigger className="-ml-1 hidden md:flex" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 hidden md:flex"
            />
            <div className="flex gap-3 items-center">
              <div className="flex gap-1">
                <Undo2 className="w-5 h-5" />
                <Redo2 className="w-5 h-5" />
              </div>
              <EditableBar />
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

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();

  return (
    <>
      <div className="block md:hidden fixed bottom-0 w-full h-14 bg-sidebar text-muted-foreground border-t border-t-gray-600/15 border-t-solid z-50 ">
        <NavMobile items={data.navMain} />
      </div>
      {/*SIDEBAR DESKTOP */}
      <Sidebar
        collapsible="icon"
        className="hidden md:block overflow-hidden [&>[data-sidebar=sidebar]>.tabs]:flex-row [&>[data-sidebar=sidebar]>.tabs]:flex"
        {...props}
      >
        <Tabs defaultValue={data.navMain[0].id} className="tabs flex-1">
          <Sidebar
            collapsible="none"
            className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r border-r-gray-500"
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent className="px-1.5 md:px-0">
                  <SidebarMenu>
                    <TabsList className="flex-col h-auto bg-transparent">
                      {data.navMain.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            tooltip={{
                              children: item.title,
                              hidden: false,
                            }}
                            isActive={activeItem.title === item.title}
                            onClick={() => {
                              setOpen(true);
                              setActiveItem(item);
                            }}
                            className="px-2.5 md:px-2"
                            asChild
                          >
                            <TabsTrigger value={item.id}>
                              <item.icon />
                            </TabsTrigger>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </TabsList>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <NavUser user={data.user} />
            </SidebarFooter>
          </Sidebar>

          {/* This is the second sidebar */}
          {/* We disable collapsible and let it fill remaining space */}
          <Sidebar
            collapsible="none"
            className="hidden flex-1 md:flex bg-primary-dark"
          >
            <SidebarContent className="px-4">
              {data.navMain.map((nav) => {
                return (
                  <TabsContent key={nav.id} value={nav.id}>
                    <SidebarGroup className="px-0">
                      <SidebarGroupContent>
                        <SelectableContent>
                          <nav.content content={nav.title} />
                        </SelectableContent>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </TabsContent>
                );
              })}
            </SidebarContent>
          </Sidebar>
        </Tabs>
      </Sidebar>
    </>
  );
}



function Teste({ content }: { content: string }) {
  return <p>{content}</p>;
}

const NavMobile = ({ items }: { items: typeof data.navMain }) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<{
    id: string;
    icon: typeof Bell;
    title: string;
    active?: boolean;
    cotent: ({ content }: { content: string }) => Element;
  }>();
  return (
    <Tabs className="w-full h-full">
      <TabsList className="flex justify-start flex-nowrap h-full overflow-x-auto scrollBar relative z-50">
        {items.map((item) => (
          <TabsTrigger
            key={item.title}
            value={item.id}
            onClick={() => {
              setOpen(true);
              //@ts-ignore
              setActiveItem(item);
            }}
            className={cn(
              "p-0.5 flex flex-col flex-1 h-full min-w-28",
              activeItem?.title === item.title
                ? "text-gray-900 data-[state=active]:bg-gray-500/15"
                : "text-gray-600"
            )}
          >
            <item.icon className="w-5 h-5" />
            <p className="text-xs">{item.title}</p>
          </TabsTrigger>
        ))}
      </TabsList>
      {open && (
        <>
          {items.map((item) => {
            return (
              <TabsContent
                value={item.id}
                key={item.id}
                className="absolute bottom-14 z-10 w-full h-56 px-4 pt-6 border-t border-t-gray-300 rounded-t-lg bg-sidebar data-[state=active]:animate-fade-in-up data-[state=inactive]:animate-fade-out-down"
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3"
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <item.content content={item.title} />
                </div>
              </TabsContent>
            );
          })}
        </>
      )}
    </Tabs>
  );
};

function AddText() {
  const { canvas } = useEditorContext();

  const textBox = new fabric.Textbox("Texto", {
    width: 140,
    fontSize: 60,
    fill: "red",
    lockSkewingX: true,
    lockScalingFlip: true,
    splitByGrapheme: true,
  });

  textBox.controls.mt.visible = false;
  textBox.controls.mb.visible = false;

  canvas?.centerObject(textBox);
  return (
    <div className="flex gap-3 flex-col">
      <button
        type="button"
        onClick={() => {
          canvas?.add(textBox);
        }}
        className="border border-gray-300 rounded-lg px-2 py-1"
      >
        Texto teste
      </button>
    </div>
  );
}

const EditableBar = () => {
  const { canvas } = useEditorContext();
  //TODO arrumar para o tipo do objeto
  const [object, setObject] = useState<fabric.Textbox>();

  const fontSizes = [12, 14, 16, 24, 28, 32, 36, 40, 44, 48, 60, 70];

  const handleChangeSize = (e: string) => {
    if (!object || !canvas) return;
    object.set({ fontSize: Number(e) });
    //TODO evento customizado: deve ser mudado
    //@ts-ignore
    canvas.fire("modified", { target: object });
    // setObject((prev: any) => {
    //   return { ...prev, fontSize: Number(e)}
    // })
    // object.setCoords()
    // object.dirty = true
    canvas.renderAll();
  };

  useEffect(() => {
    if (!canvas) return;
    canvas.on("selection:created", (canva) => {
      if (canva.selected.length > 1) {
        //@ts-ignore
        setObject(canva.selected);
        return;
      }
      //@ts-ignore
      setObject(canva.selected[0]);
    });

    canvas.on("selection:updated", (canva) => {
      console.log("new canvas", canva);
      if (canva.selected.length > 1) {
        //@ts-ignore
        setObject(canva.selected);
        return;
      }
      //@ts-ignore
      setObject(canva.selected[0]);
    });

    //@ts-ignore
    canvas.on("modified", (canva) => {
      console.log("text RESING", canva);
      // if (canva.target.length > 1) {
      //   setObject(canva.target);
      //   return;
      // }
      //@ts-ignore
      setObject(canva.target);
    });

    // canvas.on("selection:cleared", () => {
    //   setObject(null);
    // });

    return () => {
      canvas.off("selection:created");
      canvas.off("selection:cleared");
    };
  }, [canvas]);

  console.log("type", object, object?.type);

  if (!object?.type) return;

  return (
    <div>
      {object?.type === "textbox" && (
        <div className="flex gap-3">
          <Select onValueChange={handleChangeSize}>
            <SelectTrigger className="w-16">
              <SelectValue placeholder={object.fontSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>{object.fontSize.toString()}</SelectLabel> */}
                {fontSizes.map((size) => {
                  return (
                    <SelectItem
                      key={size}
                      value={size.toString()}
                      checked={size === object?.fontSize}
                      className={clsx(
                        size === object?.fontSize
                          ? "bg-gray-500/35 text-gray-900 font-semibold focus:bg-gray-500/35"
                          : "focus:bg-gray-300/50"
                      )}
                    >
                      {size}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

const SelectableContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col px-4 divide-y-2 divide-gray-600">
      <div className="pb-4">
        <Input
          className="h-8 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
          icon={<Search />}
        />
      </div>
      <div className="pt-4">{children}</div>
    </div>
  );
};
