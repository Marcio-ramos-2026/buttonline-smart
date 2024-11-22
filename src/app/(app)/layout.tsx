import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar/navbarDefault";

export default async function LayoutApp({ children }: { children: ReactNode }) {
  const session = await auth();
  console.log('session app',session)

  // if (!session) {
  //   redirect(`/login`);
  // }
  return (
    <div>
      {/* <Navbar /> */}
      <div className="mt-10 md:mt-0">{children}</div>
    </div>
  );
}
