"use client";

import { loginAction } from "@/app/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import { InputPassword } from "@/components/ui/input/inputPassword";
import { Mail } from "lucide-react";
import { useFormState } from "react-dom";
import { useFormStatus } from 'react-dom'

const initialState = {
  message: "",
};

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const { pending } = useFormStatus()

  console.log('state returns', state)

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={formAction} className="space-y-6">
            <div>
              <div className="mt-2">
                <Input
                  name="email"
                  autoComplete="email"
                  label="Email"
                  icon={<Mail />}
                />
              </div>
              {state?.errors?.email && (
                <p className="text-red-400 font-semibold pl-3">
                  {state?.errors?.email?.[0]}
                </p>
              )}
            </div>

            <div>
              <div className="mt-2">
                <InputPassword label="Senha" name="password" />
                {state?.errors?.password && (
                  <p className="text-red-400 font-semibold pl-3">
                    {state?.errors?.password?.[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button full type="submit">
                Entrar
              </Button>

              {state?.message && (
                <p className="text-red-400 font-semibold">{state.message}</p>
              )}
            </div>
          </form>

          {/* <Teste /> */}

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
