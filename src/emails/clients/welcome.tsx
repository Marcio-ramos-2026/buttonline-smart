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
import {  createTranslator } from "next-intl";
import * as React from "react";

interface NetlifyWelcomeEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: string[],
  locale?: ILocaleLang
}

const baseUrl = process.env.VERCEL_URL ?? 'http://localhost:3000'

const messages: EmailMessageLang = {
    "pt-BR": {
      "welcome": "Bem vindo a nossa plataforma",
      "intro": "Olá {name}, agora você já pode usar a sua criatividade para criar buttons incríveis.",
      "get_started_title": "Veja quais são os primeiros passos",
      "step_1": "Acesse sua conta e defina a sua nova senha.",
      "step_2": "Escolhe o modelo de button e crie a sua arte pelo editor.",
      "step_3": "Solicite o PDF para a impressão.",
      "copyright": "© Cardenas. Todos os direitos reservados.",
      "pass_tile": "Sua senha temporária"
    },
    "en": {
      "welcome": "Welcome to our platform",
      "intro": "Olá {name}, agora você já pode usar a sua criatividade para criar buttons incríveis.",
      "get_started_title": "Veja quais são os primeiros passos",
      "step_1": "Acesse sua conta e defina a sua nova senha.",
      "step_2": "Escolhe o modelo de button e crie a sua arte pelo editor.",
      "step_3": "Solicite o PDF para a impressão.",
      "copyright": "© 2024 Sua Empresa. Todos os direitos reservados."
    },
    "es-ES": {
      "welcome": "Bienvenido a nuestra plataforma",
      "intro": "Olá {name}, agora você já pode usar a sua criatividade para criar buttons incríveis.",
      "get_started_title": "Veja quais são os primeiros passos",
      "step_1": "Acesse sua conta e defina a sua nova senha.",
      "step_2": "Escolhe o modelo de button e crie a sua arte pelo editor.",
      "step_3": "Solicite o PDF para a impressão.",
      "copyright": "© 2024 Sua Empresa. Todos os direitos reservados."
    }
}

const ClientWecomeEmail = ({
  locale = 'pt-BR'
}: NetlifyWelcomeEmailProps) => {
  
  const  t = createTranslator({messages: messages[locale],locale})
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
              {t('welcome')}
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  {t('intro',{name:"wellingtom"})}
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
              <li className="mb-20">
                  {t("step_3")}
              </li>
            </ul>

            <Section className="flex items-center justify-center bg-gray-100 rounded-sm">
                <Text className="font-bold text-center text-sm text-gray-400">{t('pass_tile')}</Text>

                <Text className="font-bold text-center text-lg text-primary">aduhauhduhas</Text>
            </Section>

            <Section className="text-center">
                <Text className="text-gray-900">
                  Após o primeiro acesso essa senha não funcionará mais
                </Text>
                <Button className="bg-brand text-white rounded-lg py-3 px-[18px] cursor-pointer" href={baseUrl}>
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

export const renderClientWelcome = async (props: NetlifyWelcomeEmailProps) => {
  return await render(<ClientWecomeEmail {...props} />)
}

export default ClientWecomeEmail;
