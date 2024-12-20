import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar/navbarDefault";
import { useSidebar } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default async function LayoutApp({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect(`/login`);
  }
  return (
    <SessionProvider session={session}>
      <div>
        <Navbar />
        <div className="mt-10 md:mt-0">{children}</div>
      </div>
    </SessionProvider>
  );
}
