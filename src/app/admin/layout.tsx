import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  TesteTrigger,
} from "@/components/ui/sidebar";

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

export default function LayoutAdmin({ children }: { children: ReactNode }) {
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
