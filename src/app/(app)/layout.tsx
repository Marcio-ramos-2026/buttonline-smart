import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar/navbarDefault";
import { Folder, ImageIcon } from "lucide-react";

export default async function LayoutApp({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect(`/login`);
  }
  return (
    <div>
      <Navbar />
      <div className="fixed left-0 top-12 h-full w-16 border-r border-solid border-gray-200 flex flex-col gap-6 items-center py-10">
        <Folder />
        <ImageIcon />
      </div>
      {children}
    </div>
  );
}
