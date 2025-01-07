import { UserProfile } from "@/components/navbar/userSection/userProfile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const id = (await params).id

  const user = await prisma.user.findFirst({
    where: {
      id: id
    }
  })
  if(!user) redirect('/')

  return (
    <div className="container mx-auto py-10">
      <UserProfile user={user} />
    </div>
  );
}
