import Image from "next/image";
import { ChangePasswordForm } from "./form";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function RecoverPassword() {
  const t = useTranslations("pages.recoverPassword.changePassword");

  return (
    <>
      <div className="flex h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Buttonline"
            src="/logo.svg"
            height={46}
            width={400}
            className="mx-auto"
          />
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl text-center mt-3">
            {t("title")}
          </h3>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <ChangePasswordForm />
        </div>

        <div className="flex flex-col md:flex-row gap-1.5 md:gap-2.5 items-end md:items-start justify-start md:justify-end mt-6">
          <p>{t("gobackLogin.text")}</p>
          <Link href="/login" className="text-secondary font-semibold">
            {t("gobackLogin.link")}
          </Link>
        </div>
      </div>
    </>
  );
}
