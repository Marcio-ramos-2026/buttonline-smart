import LanguageSelector from "@/components/language-selector";
import Link from "next/link";
import { ReactNode } from "react";

export default async function LayoutLogin({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {children}
      <div className="py-2">
        <LanguageSelector />
      </div>
      <div className="mb-4">
        <Link href="politica-privacidade">Aviso de privacidade </Link>
        <Link href="politica-cookies" className="ml-8">
          Política de cookies{" "}
        </Link>
      </div>
    </div>
  );
}
