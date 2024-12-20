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

// This is sample data.
const data = {
  user: {
    name: "Usuário Teste",
    email: "usuário@teste.com",
  },
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  
  return (
    <Sidebar collapsible="icon" {...props} className="">
      <TriggerSidebar isOpenSidebar={open} />
      <SidebarHeader>{/*imagem logo*/}</SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} title="Pessoas" prefix="/admin" />
      </SidebarContent>
      <SidebarFooter>
        <Link href={"/"} className="mb-4">
          <Button variant={"outline"} color={"success"} full icon={<Pencil />} size={open ? 'default' : 'sm'}>
            {open && 'Editor'}
          </Button>
        </Link>
        <NavUserAdmin user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
