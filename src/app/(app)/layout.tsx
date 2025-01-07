import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function LayoutApp({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect(`/login`);
  }

  return (
    <SessionProvider session={session}>
      <div>
        <div className="mt-10 md:mt-0">{children}</div>
      </div>
    </SessionProvider>
  );
}
