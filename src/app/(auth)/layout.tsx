import LanguageSelector from "@/components/language-selector";
import Link from "next/link";
import { ReactNode } from "react";
import { LayoutFooter } from "./layoutFooter";

export default async function LayoutLogin({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-3">
      {children}
      <div className="py-2">
        <LanguageSelector />
      </div>
      <LayoutFooter />
    </div>
  );
}
