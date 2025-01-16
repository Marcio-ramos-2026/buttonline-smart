import { UserProfile } from "@/components/navbar/userSection/userProfile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { validateVoucher } from "@/lib/validateVoucher";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const session = await auth();

  const id = (await params).id;

  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });
  if (!user) redirect("/");

  if (Number(session?.user.id) !== user.id) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center h-[calc(100vh_-_64px)] w-full">
        <p className="text-3xl font-semibold">Usuário inválido.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <UserProfile user={user} />
    </div>
  );
}
