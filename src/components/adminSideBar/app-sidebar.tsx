"use client";

import * as React from "react";
import { FileText, Pencil, UserRound, UsersRound } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar-admin";
import { NavUserAdmin } from "../nav-user-admin";
import { TriggerSidebar } from "./triggerSideBar";
import Link from "next/link";
import { Button } from "../ui/button";
import type { User as UserType } from "@prisma/client";

interface AppSideBarAdminProps extends React.ComponentProps<typeof Sidebar> {
  user?: UserType;
}

// This is sample data.
const data = {
  navMain: [
    {
      title: "Usuários",
      url: "/users",
      icon: UserRound,
    },
    {
      title: "Clientes",
      url: "/clients",
      icon: UsersRound,
    },
    // {
    //   title: "Pedidos",
    //   url: "#",
    //   icon: FileText
    // }
  ],
};

export function AppSidebar({ ...props }: AppSideBarAdminProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="hidden md:block">
        <TriggerSidebar isOpenSidebar={open} />
      </div>
      {/* <SidebarHeader>imagem logo</SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} title="Pessoas" prefix="/admin" />
      </SidebarContent>
      <SidebarFooter>
        <Link href={"/"} className="mb-4">
          <Button
            variant={"outline"}
            color={"success"}
            full
            icon={<Pencil />}
            size={open ? "default" : "sm"}
          >
            {open && "Editor"}
          </Button>
        </Link>
        <div className="flex justify-center [&_ul]:w-fit">
          <NavUserAdmin user={props.user as UserType} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
