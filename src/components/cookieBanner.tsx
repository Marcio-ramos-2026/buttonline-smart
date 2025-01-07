"use client";

import CookieConsent from "react-cookie-consent";
import { useTranslations } from "next-intl";

const CookieBanner = () => {
  const t = useTranslations("cookieConsent");

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("btn")}
      cookieName="userConsentXXXXXXX"
      style={{ background: "#354a5f" }}
      buttonStyle={{
        color: "#fff",
        fontSize: "13px",
        background: "#ef7224",
        borderRadius: "5px",
      }}
      expires={150}
    >
      {t("text")}
    </CookieConsent>
  );
};

export default CookieBanner;
