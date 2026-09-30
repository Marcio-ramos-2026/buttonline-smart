import { Inter } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from "@/components/cookieBanner";
import { GoogleTagManager } from "@next/third-parties/google";
import { auth } from "@/auth";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const messages = await getMessages();

  const session = await auth();

  // Only internal identifiers go to GTM/GA. Never send name or email (Google Analytics forbids PII).
  const gtmUser = session?.user?.id
    ? { user_id: String(session.user.id), user_role: session.user.role ?? "" }
    : null;

  return (
    <html lang={locale}>
      {/* Pushed inline in <head> so the values exist before GTM's Initialization event.
          The dataLayer prop of <GoogleTagManager> pushes after gtm.js, too late for the Google tag. */}
      {gtmId && gtmUser && (
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];window.dataLayer.push(${JSON.stringify(gtmUser).replace(/</g, "\\u003c")});`,
            }}
          />
        </head>
      )}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <CookieBanner />
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
