'use server'

import { SidebarHeader, SidebarInput } from "@/components/ui/sidebar";
import { fetchIcons } from "@/lib/db";

export const TabIcons = async () => {
  const icons = await fetchIcons();

  console.log("iiii", icons);

  return (
    <>
      {/* <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Icones</div>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader> */}

      <h1 className="mt-4">ICONS</h1>
    </>
  );
};
