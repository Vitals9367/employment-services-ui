import { useEffect, useState } from 'react'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Locale } from 'next-drupal'
import { useCookies } from 'hds-react'

export const useConsentStatus = (cookieId: string) => {
  const { getAllConsents } = useCookies();
  const consents = getAllConsents();
  return consents[cookieId];
};

export const useCookieConsents = (): any => {
  const { locale } = useRouter()
  const { t } = useTranslation()
  const [language, setLanguage] = useState(locale);
  const onLanguageChange = (newLang: Locale) => setLanguage(newLang);

  return {
    siteName: t('site_title'),
    currentLanguage: language,
    language: {
      onLanguageChange,
    },
    focusTargetSelector: '#focused-element-after-cookie-consent-closed',
    optionalCookies: {
      groups: [
        {
          commonGroup: 'statistics',
          cookies: [
            {
              id: 'matomo',
              hostName: 'tyollisyyspalvelut.hel.fi',
              name: '_pk_id.*',
              description: t('cookies.matomo_description'),
              expiration: `393 ${t('cookies.period_minutes')}`,
            },
            {
              id: 'matomo_ses',
              hostName: 'tyollisyyspalvelut.hel.fi',
              name: '_pk_ses.*',
              description: t('cookies.matomo_description'),
              expiration: `30 ${t('cookies.period_minutes')}`,
            },
            {
              id: 'matomo_id_kartta',
              name: '_pk_id.*',
              hostName: 'palvelukartta.hel.fi',
              description: t('cookies.matomo_description'),
              expiration: `393 ${t('cookies.period_days')}`,
            },
            {
              id: 'rns',
              name: 'rnsbid',
              hostName: 'reactandshare.com',
              description: t('cookies.rns_description'),
              expiration: '-',
            },
            {
              id: 'rnsbid_ts',
              name: 'rnsbid_ts',
              hostName: 'reactandshare.com',
              description: t('cookies.rns_description'),
              expiration: '-',
            },
            {
              id: 'rns_reaction',
              name: 'rns_reaction_*',
              hostName: 'reactandshare.com',
              description: t('cookies.rns_description'),
              expiration: '-',
            },
          ],
        },
      ],
    },
  };
} 

export const useMatomo = (cookieConsent: boolean) => {
  const { MATOMO_URL: url, MATOMO_SITE_ID: siteId } = getConfig().publicRuntimeConfig

  useEffect(() => {
    const _paq = (window._paq = window._paq || [])
    const script = document.createElement("script")
    script.async = true
    script.src = `${url}piwik.min.js`
    script.type = "text/javascript"
    document.head.appendChild(script)
  
    // This means no tracking or cookies unless consent is given.
    _paq.push(['requireConsent'])
  
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["setCookieDomain", "*.tyollisyyspalvelut.hel.fi"])
  
    _paq.push(["trackPageView"])
  
    _paq.push(["enableLinkTracking"])
    _paq.push(["setTrackerUrl", `${url}tracker.php`])
    _paq.push(["setSiteId", siteId])
  
    // Enable or disable tracking by the selected consent
    cookieConsent ? window._paq.push(['setConsentGiven']) : window._paq.push(['forgetConsentGiven'])
  }, [cookieConsent])
}

export const useReactAndShare = (
  cookieConsent: boolean | undefined,
  lang: string | undefined,
  pageTitle: string | undefined
) => {
  useEffect(() => {
    if (cookieConsent !== true) {
      return
    }

    let reactAndShareApiKey = getConfig().publicRuntimeConfig.REACT_AND_SHARE_FI
    if (lang === 'en') {
      reactAndShareApiKey = getConfig().publicRuntimeConfig.REACT_AND_SHARE_EN
    } else if (lang === 'sv') {
      reactAndShareApiKey = getConfig().publicRuntimeConfig.REACT_AND_SHARE_SV
    }

    const script = document.createElement("script")
    const resourceUrl = 'https://cdn.reactandshare.com/plugin/rns.js'
    script.src = resourceUrl
    script.type = "text/javascript"

    window.rnsData = {
      apiKey: reactAndShareApiKey,
      title: pageTitle || 'Työllisyyspalvelut',
      canonicalUrl: window.location.href,
      categories: ['Työllisyyspalvelut']
    }

    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [cookieConsent, lang])
}
