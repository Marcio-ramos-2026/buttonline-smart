import LanguageSelector from "@/components/language-selector";
import { ReactNode } from "react";

export default async function LayoutLogin({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {children}
      <div className="pb-4 md:pb-10">
        <LanguageSelector />
      </div>
    </div>
  );
}
