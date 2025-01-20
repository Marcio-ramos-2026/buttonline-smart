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
  Link,
} from "@react-email/components";
import {  createTranslator } from "next-intl";
import { userAgent } from "next/server";
import * as React from "react";
import type { User } from "@prisma/client";

interface NetlifyWelcomeEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: string[],
  locale?: ILocaleLang,
  user: User
}

const baseUrl = process.env.VERCEL_URL ?? 'http://localhost:3000'

const messages: EmailMessageLang = {
    "pt-BR": {
      "welcome": "Bem vindo a nossa plataforma",
      "intro": "Olá {name}, agora você já pode usar a sua criatividade para criar buttons incríveis.",
      "get_started_title": "Veja quais são os primeiros passos",
      "step_1": "Escolhe o modelo de button e crie a sua arte pelo editor.",
      "step_2": "Solicite o PDF para a impressão.",
      "copyright": "© Cardenas. Todos os direitos reservados.",
      "button": "Acessar a minha conta"
    },
    "en": {
      "welcome": "Welcome to our platform",
      "intro": "Olá {name}, agora você já pode usar a sua criatividade para criar buttons incríveis.",
      "get_started_title": "Veja quais são os primeiros passos",
      "step_1": "Escolhe o modelo de button e crie a sua arte pelo editor.",
      "step_2": "Solicite o PDF para a impressão.",
      "copyright": "© 2024 Sua Empresa. Todos os direitos reservados.",
      "button": "Access my account"
    },
    "es-ES": {
      "welcome": "Bienvenido a nuestra plataforma",
      "intro": "Olá {name}, agora você já pode usar a sua criatividade para criar buttons incríveis.",
      "get_started_title": "Veja quais são os primeiros passos",
      "step_1": "Escolhe o modelo de button e crie a sua arte pelo editor.",
      "step_2": "Solicite o PDF para a impressão.",
      "copyright": "© 2024 Sua Empresa. Todos os direitos reservados.",
      "button": "Acceder a mi cuenta"
    }
}

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

const ClientWecomeEmail = ({
  locale = 'pt-BR',
  user = defaultUser
}: NetlifyWelcomeEmailProps) => {
  
  const  t = createTranslator({messages: messages[locale],locale})
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
          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">
              {t('welcome')}
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  {t('intro',{name: user.name})}
                </Text>

                <Text className="text-base">{t('get_started_title')}</Text>
              </Row>
            </Section>

            <ul>
              <li className="mb-20">
                  {t("step_1")}
              </li>
              <li className="mb-20">
                  {t("step_2")}
              </li>
            </ul>

            <Section className="text-center">
                <Link className="bg-brand text-white rounded-lg py-3 px-[18px] cursor-pointer" href={baseUrl}>
                  Acessar a minha conta
                </Link>
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

export const renderClientWelcome = async (props: NetlifyWelcomeEmailProps) => {
  return await render(<ClientWecomeEmail {...props} />)
}

export default ClientWecomeEmail;
