"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/login";
import { Input } from "@/components/ui/input/input";
import { Mail } from "lucide-react";
import { InputPassword } from "@/components/ui/input/inputPassword";
import { Button } from "@/components/ui/button";

const initialState = {
  message: "",
};

export const FormLogin = () => {
  const [state, formAction] = useFormState(loginAction, initialState);
  const { pending } = useFormStatus();

  return (
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
  );
};
