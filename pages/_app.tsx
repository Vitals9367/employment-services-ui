import '../styles/globals.scss'
import { appWithTranslation, useTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent"
import { useState } from 'react'

import { useMatomo } from '@/lib/helpers'

function MyApp({ Component, pageProps }: AppProps) {

  const { t } = useTranslation();

  const [cookieConsent, setCookieConsent] = useState(getCookieConsentValue('tyollisyyspalvelut_cookie_consent'));
  useMatomo(cookieConsent);

  return (
    <>
      <Component {...pageProps} />
      <CookieConsent
        location="bottom"
        buttonText={t("cookies.accept")}
        ariaAcceptLabel={t("cookies.accept")}
        enableDeclineButton
        declineButtonText={t("cookies.decline")}
        ariaDeclineLabel={t("cookies.decline")}
        cookieName="tyollisyyspalvelut_cookie_consent"
        containerClasses="cookie-banner"
        contentClasses="cookie-banner-content"
        style={{ background: "#0000bf", color: "#fff", fontSize: "18px", alignItems: "center", maxHeight: "50vh", overflowX: "hidden", overflowY: "auto" }}
        buttonStyle={{ background: "#fff", color: "#0000bf", fontSize: "16px", fontWeight: "500", lineHeight: "1.5", border: "2px solid #fff", padding: "16px 24px", margin: "0 8px 16px" }}
        declineButtonStyle={{ background: "#0000bf", color: "#fff", fontSize: "16px", fontWeight: "500", lineHeight: "1.5", border: "2px solid #fff", padding: "16px 24px", margin: "0 8px 16px" }}
        expires={180}
        flipButtons
        onAccept={() => {
          setCookieConsent('true');
        }}
        onDecline={() => {
          setCookieConsent('false');
        }}
      >
      <p>{t("cookies.text")}</p>
      <a href={t("cookies.url")} style={{ color: "#fff" }}>{t("cookies.link_text")}</a>
    </CookieConsent>
  </>
  )
}

export default appWithTranslation(MyApp)
