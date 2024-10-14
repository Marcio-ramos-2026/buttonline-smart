'use client'

import { FileSearch, House, UserRound, UsersRound } from "lucide-react";
import NavbarMobile from "./mobile";
import { NavbarAdmin } from "./navbarAdmin";

const navigation = [
    { name: "Home", href: "#", icon: House, current: true },
    { name: "Clientes", href: "#", icon: UsersRound, current: false },
    { name: "Usuários", href: "#", icon: UserRound, current: false },
    { name: "Pedidos", href: "#", icon: FileSearch, current: false }
  ];

export default function NavbarAdminRoot() {
  const Nav =  <NavbarAdmin navigation={navigation} />

  return (
    <>
      <NavbarMobile>
        {Nav}
      </NavbarMobile>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {Nav}
      </div>
    </>
  );
}
