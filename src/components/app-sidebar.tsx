"use client"

import * as React from "react"
import {
  FileText,
  UserRound,
  UsersRound,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user-admin"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar-admin"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Usuários",
      url: "/users",
      icon: UserRound
    },
    {
      title: "Clientes",
      url: "/clients",
      icon: UsersRound
    },
    // {
    //   title: "Pedidos",
    //   url: "#",
    //   icon: FileText
    // }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/*imagem logo*/}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} title='Teste' prefix="/admin" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
