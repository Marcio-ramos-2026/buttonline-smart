import Image from "next/image";
import { FormLogin } from "./formLogin";
import Link from "next/link";

export default function LoginPage() {
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
              Acessar o buttonline
            </h3>
            <p className="">
              Não tem uma conta?{" "}
              <a
                href="javascript:void(0)"
                className="font-medium text-primary hover:text-primary-dark underline"
              >
                Criar uma
              </a>
            </p>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
          <FormLogin />
        </div>
        <div className="flex justify-end">
          <Link href={"/recuperarSenha"} className="text-primary">
            Esqueci a senha
          </Link>
        </div>
      </div>
    </main>
  );
}
