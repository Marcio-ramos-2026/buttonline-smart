"use client";

import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import { NavUserSection } from "./userSection/userSection";
import type {User as UserType} from '@prisma/client'

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
  user: UserType
};

export const Navbar = ({ navigation, user }: NavigationType) => {
  return (
    <nav className="bg-primary fixed top-0 w-full z-50 border-b border-b-gray-800/10 block md:hidden">
      <div className="flex justify-end items-center h-10 px-3">
        <NavUserSection user={user} />
      </div>
    </nav>
  );
};
