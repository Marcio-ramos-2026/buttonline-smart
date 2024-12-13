import Image from "next/image";
import { FormLogin } from "./formLogin";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("pages.signIn");

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <Image
            alt="Buttonline"
            src="/logo.svg"
            height={46}
            width={400}
            className="mx-auto"
          />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              {t("title")}
            </h3>
            <p className="">
              {t("createAcc.question")}{" "}
              <a
                href="javascript:void(0)"
                className="font-medium text-primary hover:text-primary-dark underline"
              >
                {t("createAcc.link")}
              </a>
            </p>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
          <FormLogin />
        </div>
        <p className="text-right"> {t("forgetPassword")}</p>
      </div>
    </main>
  );
}
