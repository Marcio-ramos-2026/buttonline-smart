"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUserAdminSection } from "./navbar/userSection/userAdminSection";
import type {User as UserType} from '@prisma/client'

export function NavUserAdmin({
  user,
}: {
  user: UserType;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <NavUserAdminSection user={user} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
