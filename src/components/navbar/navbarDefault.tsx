'use client'

import { signOut } from "next-auth/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type NavigationType = {
  navigation?: {
    name: string;
    href: string;
    icon: ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, "ref"> & {
        title?: string;
        titleId?: string;
      } & RefAttributes<SVGSVGElement>
    >;
    current: boolean;
  }[];
};

export const Navbar = ({ navigation }: NavigationType) => {
  const router = useRouter();
  return (
    <nav className="bg-primary fixed top-0 w-full z-50 border-b border-b-gray-800/10 block md:hidden">
      <div className="flex justify-end items-center h-10 px-3">
        <button
          onClick={() => {
            signOut({ redirect: false });
            router.push("/login");
          }}
          className="text-rose-600 bg-rose-400/25 rounded-full h-7 w-7 flex items-center justify-center"
        >
          <LogOutIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};
