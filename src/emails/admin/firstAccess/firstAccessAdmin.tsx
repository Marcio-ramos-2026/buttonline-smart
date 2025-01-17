import { EmailMessageLang, ILocaleLang } from "@/lib/langs";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  render,
} from "@react-email/components";
import { createTranslator } from "next-intl";
import * as React from "react";
import type { User } from "@prisma/client";

interface NetlifyFirstAccessProps {
  locale?: ILocaleLang;
  user: User;
  tempPassword: string;
}

const baseUrl = process.env.VERCEL_URL ?? "http://localhost:3000";

const messages: EmailMessageLang = {
  "pt-BR": {
    welcome: "Bem vindo ao Buttonline",
    intro:
      "Olá {name}, você foi convidado a ser um administrador em nossa plataforma.",
    get_started_title: "Veja quais são os primeiros passos",
    step_1: "Acesse sua conta e defina a sua nova senha.",
    step_2:
      "Acesse as telas de clientes e usuários para monitorar os usuários.",
    copyright: "© Cardenas. Todos os direitos reservados.",
    pass_tile: "Sua senha temporária",
    button: "Acessar a minha conta",
  },
  en: {
    welcome: "Welcome to Buttonline",
    intro:
      "Hello {name}, you have been invited to be an administrator on our platform.",
    get_started_title: "See the first steps",
    step_1: "Access your account and set your new password.",
    step_2: "Go to the client and user screens to monitor the users.",
    copyright: "© Cardenas. All rights reserved.",
    pass_tile: "Your temporary password",
    button: "Access my account",
  },
  "es-ES": {
    welcome: "Bienvenido a Buttonline",
    intro:
      "Hola {name}, has sido invitado a ser un administrador en nuestra plataforma.",
    get_started_title: "Mira cuáles son los primeros pasos",
    step_1: "Accede a tu cuenta y configura tu nueva contraseña.",
    step_2:
      "Accede a las pantallas de clientes y usuarios para monitorear a los usuarios.",
    copyright: "© Cardenas. Todos los derechos reservados.",
    pass_tile: "Tu contraseña temporal",
    button: "Acceder a mi cuenta",
  },
};

const defaultUser: User = {
  id: 1,
  email: "teste@teste.com",
  name: "Teste da silva",
  createdAt: new Date(),
  deletedAt: null,
  updatedAt: new Date(),
  roleId: 1,
  emailVerified: null,
  image: null,
  lastAccess: null,
  password: null,
  voucherTime: null,
};

const FirstAccess = ({
  locale = "pt-BR",
  user = defaultUser,
  tempPassword = 'senhatemporaria123',
}: NetlifyFirstAccessProps) => {
  const t = createTranslator({ messages: messages[locale], locale });
  return (
    <Html>
      <Head />
      <Preview>Buttonline</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#354A5F",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          <Img
            src={`/static/logo-inverse.png`}
            alt="Netlify"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">
              {t("welcome")}
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  {t("intro", { name: user.name })}
                </Text>

                <Text className="text-base">{t("get_started_title")}</Text>
              </Row>
            </Section>

            <ul>
              <li className="mb-20">{t("step_1")}</li>
              <li className="mb-20">{t("step_2")}</li>
            </ul>

            <Section className="flex items-center justify-center bg-gray-100 rounded-sm">
              <Text className="font-bold text-center text-sm text-gray-400">
                {t("pass_tile")}
              </Text>

              <Text className="font-bold text-center text-lg text-primary">
                {tempPassword}
              </Text>
            </Section>

            <Section className="text-center mt-20">
              <Button
                className="bg-brand text-white rounded-lg py-3 px-[18px] cursor-pointer"
                href={`${baseUrl}/login`}
              >
                Acessar a minha conta
              </Button>
            </Section>
          </Container>

          <Container className="mt-20">
            <Text className="text-center text-gray-400 mb-45">
              {t("copyright")}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const renderFirstAccess = async (props: NetlifyFirstAccessProps) => {
  return await render(<FirstAccess {...props} />);
};

export default FirstAccess;
