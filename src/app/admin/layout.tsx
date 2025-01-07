import { ReactNode } from "react";
import { AppSidebar } from "@/components/adminSideBar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar-admin";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LanguageSelector from "@/components/language-selector";

export default async function LayoutAdmin({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect(`/login`);
  }

  return (
    <SessionProvider session={session}>
      <header className="flex shrink-0 items-center gap-2 border-b bg-background p-2 md:p-4 h-14 md:h-auto">
        <div className="space-x-2 text-black ml-auto">
          <LanguageSelector />
        </div>
      </header>
      {/*@ts-ignore */}
      <SidebarProvider style={{ "--sidebar-width-icon": "64px" }}>
        <AppSidebar />
        <SidebarInset>
          {/* <header className="py-2 px-4 flex items-center">
        </header> */}
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
