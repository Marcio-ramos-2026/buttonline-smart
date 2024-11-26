import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  TesteTrigger,
} from "@/components/ui/sidebar-admin";

export default async function LayoutAdmin({ children }: { children: ReactNode }) {
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="py-2 px-4 flex items-center">
          {/* <SidebarTrigger /> */}
          <TesteTrigger />
        </header>
        <div className="p-6 flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
