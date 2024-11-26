import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavUserSection({
  user
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-within:outline-none">
        <div className="flex items-center justify-center bg-gray-50 h-8 w-8 rounded-full">
          <User className="h-5 w-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notificações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button
              type="button"
              onClick={() => {
                signOut({ redirect: false });
                router.push("/login");
              }}
              className="text-rose-600"
            >
              <LogOut />
            </button>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
