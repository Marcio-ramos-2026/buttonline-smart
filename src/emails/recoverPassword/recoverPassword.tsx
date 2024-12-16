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

interface NetlifyRecoverPasswordProps {
  locale?: ILocaleLang;
  user: User;
}

const baseUrl = process.env.VERCEL_URL ?? "http://localhost:3000";

const messages: EmailMessageLang = {
  "pt-BR": {
    welcome: "Olá {name}.",
    intro:
      "Recebemos uma solicitação para restaurar sua senha de acesso em nosso site.",
    subject:
      "Se você reconhece essa ação, clique no link a seguir para prosseguir: {link}",
    end_1: "Atenciosamente,",
    end_2: "Buttonline.",
  },
  en: {
    welcome: "Hello {name}.",
    intro:
      "We have received a request to reset your account password on our website.",
    subject:
      "If you recognize this action, click the following link to proceed: {link}",
    end_1: "Sincerely,",
    end_2: "Buttonline.",
  },
  "es-ES": {
    welcome: "Hola {name}.",
    intro:
      "Hemos recibido una solicitud para restablecer la contraseña de su cuenta en nuestro sitio web.",
    subject:
      "Si reconoce esta acción, haga clic en el siguiente enlace para continuar: {link}",
    end_1: "Atentamente,",
    end_2: "Buttonline.",
  },
};

const defaultUser: User = {
  id: "testeId",
  email: "teste@teste.com",
  name: "Teste da silva",
  createdAt: new Date(),
  updatedAt: new Date(),
  roleId: 1,
  emailVerified: null,
  image: null,
  lastAccess: null,
  password: null
};

const RecoverPassword = ({
  locale = "pt-BR",
  user = defaultUser,
}: NetlifyRecoverPasswordProps) => {
  const t = createTranslator({ messages: messages[locale], locale });
  console.log('TEXTTTTTTTT', messages[locale].batata)
  return (
    <Html>
      <Head />
      <Preview>Netlify</Preview>
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
              {t("welcome", { name: user.name })}
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">{t("intro")}</Text>

                <Text className="text-base">
                  {t("subject", {
                    link: `${baseUrl}/recuperarSenha/trocarSenha?user_id=${user.id}`,
                  })}
                </Text>
              </Row>
            </Section>

            <Section className="flex items-center justify-center bg-gray-100 rounded-sm">
              <Text className="font-bold text-center text-sm text-gray-400">
                {t("end_1")}
              </Text>

              <Text className="font-bold text-center text-lg text-primary">
                {t("end_2")}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const renderRecoverPassword = async (
  props: NetlifyRecoverPasswordProps
) => {
  return await render(<RecoverPassword {...props} />);
};

export default RecoverPassword;
