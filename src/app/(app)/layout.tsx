import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar/navbarDefault";

export default async function LayoutApp({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect(`/login`);
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
