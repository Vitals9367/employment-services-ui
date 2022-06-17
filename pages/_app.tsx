import '../styles/globals.scss'
import { appWithTranslation, useTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent"
import { useState } from 'react'

import { useMatomo } from '@/hooks/useAnalytics'

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation()
  const [cookieConsent, setCookieConsent] = useState<string>(getCookieConsentValue('tyollisyyspalvelut_cookie_consent'))
  useMatomo(cookieConsent)

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
        style={{ background: "var(--color-bus)", color: "var(--color-white)", fontSize: "var(--fontsize-body-l)", alignItems: "center", maxHeight: "50vh", overflowX: "hidden", overflowY: "auto" }}
        buttonStyle={{ background: "var(--color-bus)", color: "var(--color-white)", fontSize: "var(--fontsize-body-m)", fontWeight: "500", lineHeight: "1.5", border: "2px solid var(--color-white)", padding: "var(--spacing-s) var(--spacing-m)", margin: "0 var(--spacing-2-xs) var(--spacing-s)" }}
        declineButtonStyle={{ background: "var(--color-bus)", color: "var(--color-white)", fontSize: "var(--fontsize-body-m)", fontWeight: "500", lineHeight: "1.5", border: "2px solid var(--color-white)", padding: "var(--spacing-s) var(--spacing-m)", margin: "0 var(--spacing-2-xs) var(--spacing-s)" }}
        expires={180}
        flipButtons
        onAccept={() => {
          setCookieConsent('true')
        }}
        onDecline={() => {
          setCookieConsent('false')
        }}
      >
      <p>{t("cookies.text")}</p>
      <a href={t("cookies.url")} style={{ color: "var(--color-white)" }}>{t("cookies.link_text")}</a>
    </CookieConsent>
  </>
  )
}

export default appWithTranslation(MyApp)
