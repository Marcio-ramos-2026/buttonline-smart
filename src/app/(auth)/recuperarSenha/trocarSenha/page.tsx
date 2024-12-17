import Image from "next/image";
import { ChangePasswordForm } from "./form";

export default function RecoverPassword() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Buttonline"
            src="/logo.svg"
            height={46}
            width={400}
            className="mx-auto"
          />
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl text-center mt-3">
            Recuperar senha
          </h3>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <ChangePasswordForm />
        </div>
      </div>
    </>
  );
}
