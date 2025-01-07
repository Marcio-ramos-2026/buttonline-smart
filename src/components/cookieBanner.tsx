"use client";


// components/CookieBanner.js
import React, { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';

const CookieBanner = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Garantir que o código só rode no lado do cliente
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Não renderiza no servidor

  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceitar"
      cookieName="userConsentXXXXXXX"
      style={{ background: "#2B373B" }}
      buttonStyle={{
        color: "#4e503b",
        fontSize: "13px",
        background: "#f1d600",
        borderRadius: "5px",
      }}
      expires={150}
    >
      Este site usa cookies para garantir que você tenha a melhor experiência.
    </CookieConsent>
  );
};

export default CookieBanner;
