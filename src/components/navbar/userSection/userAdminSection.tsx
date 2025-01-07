'use client'

import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Pencil,
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
} from "../../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip } from "../../tooltip/tooltip";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function NavUserAdminSection({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const t = useTranslations("pages.navUserSection");

  return (
    <DropdownMenu>
      <Tooltip content={t("label")}>
        <DropdownMenuTrigger className="focus-within:outline-none">
          <div className="flex items-center justify-center bg-gray-50 h-8 w-8 rounded-full">
            <User className="h-5 w-5" />
          </div>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
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
          <DropdownMenuItem className="hover:bg-gray-300 rounded-md focus:bg-gray-300">
            <Link href={`/userProfile`}>
              <BadgeCheck />
              {t("perfil")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-300 rounded-md focus:bg-gray-300">
            <Bell />
            {t("notifications")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-gray-300 rounded-md p-0 focus:bg-gray-300">
            <button
              type="button"
              onClick={() => {
                signOut({ redirect: false });
                router.push("/login");
              }}
              className="flex gap-1 w-full items-center px-2 py-1.5"
            >
              <LogOut className="text-rose-600" />
              {t("logOut")}
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
