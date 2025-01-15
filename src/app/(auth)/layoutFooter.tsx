"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export const LayoutFooter = () => {
  const t = useTranslations("pages.signIn");
  return (
    <div className="mb-4">
      <Link href="politica-privacidade">{t("pricavyNotice")}</Link>
      <Link href="politica-cookies" className="ml-8">
        {t("cookiesPolicy")}
      </Link>
    </div>
  );
};
