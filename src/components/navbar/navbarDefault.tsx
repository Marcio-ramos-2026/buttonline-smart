"use client";

import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import { NavUser } from "./userSection";

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

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export const Navbar = ({ navigation }: NavigationType) => {
  return (
    <nav className="bg-primary fixed top-0 w-full z-50 border-b border-b-gray-800/10 block md:hidden">
      <div className="flex justify-end items-center h-10 px-3">
        <NavUser user={user} />
      </div>
    </nav>
  );
};
