"use client";

import { registerAction } from "@/app/actions/register";
import { Alert } from "@/components/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/inputPassword";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  message: "",
};

export const RegisterForm = () => {
  //@ts-ignore
  const [state, formAction] = useFormState(registerAction, initialState);

  // console.log("state", state);

  return (
    <form action={formAction} className="space-y-2">
      <div>
        <label
          htmlFor="name"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Nome
        </label>
        <div className="mt-1">
          <Input name="name" type="text" required />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Email
        </label>
        <div className="mt-1">
          <Input name="email" type="email" required autoComplete="email" />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Senha
        </label>
        <div className="mt-1">
          <InputPassword name="password" required />
        </div>
      </div>

      {state.error && (
        <Alert variant="danger" content={state.error as string} title='Falha ao cadastrar-se' />
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      full
      className="mt-4"
      loading={pending}
      disabled={pending}
      type="submit"
    >
      Cadastrar
    </Button>
  );
};
