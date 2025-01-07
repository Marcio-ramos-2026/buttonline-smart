"use client";

import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import { NavUserSection } from "./userSection/userSection";

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
  name: "Usuário Teste",
  email: "usuário@teste.com",
}

export const Navbar = ({ navigation }: NavigationType) => {
  return (
    <nav className="bg-primary fixed top-0 w-full z-50 border-b border-b-gray-800/10 block md:hidden">
      <div className="flex justify-end items-center h-10 px-3">
        <NavUserSection user={user} />
      </div>
    </nav>
  );
};
