"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUserSection } from "./navbar/userSection/userSection";

export function NavUser({
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
        <NavUserSection user={user} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
