import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {routing} from '@/i18n/routing';
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import {NextIntlClientProvider} from 'next-intl';


interface LangParams {
  locale: string;
}

//@ts-ignore
export async function generateMetadata({params: {locale}}) {
  const t = await getTranslations({locale, namespace: 'test'});
 
  return {
    title: t('title')
  };
}

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Buttonline - Ferramenta inteligente para geração de buttons",
//   description: "Editor online de buttons",
// };

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: LangParams;
}>) {
  const messages = await getMessages();

  return (
    <html lang={params.locale}>
      <body className={inter.className}>
          <NextIntlClientProvider messages={messages} locale={params.locale}>{children}</NextIntlClientProvider>
        </body>
    </html>
  );
}
