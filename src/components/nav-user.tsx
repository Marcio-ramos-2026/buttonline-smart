"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUserSection } from "./navbar/userSection/userSection";
import type {User as UserType} from '@prisma/client'

export function NavUser({
  user,
}: {
  user: UserType;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <NavUserSection user={user} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
