"use client";

import * as React from "react";
import {
  BadgeCheck,
  Baseline,
  Bell,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  ImageIcon,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import FabricContextProvider, {
  RenderCanvas,
  useEditorContext,
} from "@/context/editor";
import * as fabric from "fabric";

// This is sample data
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
      icon: Baseline,
      title: "Texto4",
      content: Teste,
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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Inbox</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="h-full">
              <RenderCanvas />
          </main>
          {/* <div className="flex flex-1 flex-col gap-4 p-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="aspect-video h-12 w-full rounded-lg bg-muted/50"
              />
            ))}
          </div> */}
        </SidebarInset>
      </SidebarProvider>
    </FabricContextProvider>
  );
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
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
          {/* This is the first sidebar */}
          {/* We disable collapsible and adjust width to icon. */}
          {/* This will make the sidebar appear as icons. */}
          <Sidebar
            collapsible="none"
            className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
          >
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    className="md:h-8 md:p-0"
                  >
                    <a href="#">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <Command className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">Acme Inc</span>
                        <span className="truncate text-xs">Enterprise</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent className="px-1.5 md:px-0">
                  <SidebarMenu>
                    <TabsList className="flex-col h-auto">
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
          <Sidebar collapsible="none" className="hidden flex-1 md:flex">
            <SidebarHeader className="gap-3.5 border-b p-4">
              <div className="flex w-full items-center justify-between">
                <div className="text-base font-medium text-foreground">
                  {activeItem.title}
                </div>
                <Label className="flex items-center gap-2 text-sm">
                  <span>Unreads</span>
                  <Switch className="shadow-none" />
                </Label>
              </div>
              <SidebarInput placeholder="Type to search..." />
            </SidebarHeader>
            <SidebarContent className="pl-2">
              {data.navMain.map((nav) => {
                return (
                  <TabsContent key={nav.id} value={nav.id}>
                    <SidebarGroup className="px-0">
                      <SidebarGroupContent>
                        <nav.content content={nav.title} />
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

function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
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

  textBox.controls.mt.visible = false
  textBox.controls.mb.visible = false

  canvas?.centerObject(textBox)
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
