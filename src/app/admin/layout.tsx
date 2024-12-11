import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar-admin";
import { SessionProvider } from "next-auth/react";

export default async function LayoutAdmin({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      {/*@ts-ignore */}
      <SidebarProvider style={{ "--sidebar-width-icon": "64px" }}>
        <AppSidebar />
        <SidebarInset>
          {/* <header className="py-2 px-4 flex items-center">
        </header> */}
          <div className="p-6 flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
