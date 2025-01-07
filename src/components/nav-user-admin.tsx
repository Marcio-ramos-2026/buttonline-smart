"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUserAdminSection } from "./navbar/userSection/userAdminSection";

export function NavUserAdmin({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <NavUserAdminSection user={user} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
