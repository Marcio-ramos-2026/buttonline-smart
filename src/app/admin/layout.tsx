import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  TesteTrigger,
} from "@/components/ui/sidebar-admin";
import { auth } from "@/auth";

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

export default async function LayoutAdmin({ children }: { children: ReactNode }) {
  const session = await auth();
  console.log('session',session)
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
