import { useEffect } from 'react'
import getConfig from 'next/config'

export const useMatomo = (cookieConsent: string) => {
  const { MATOMO_URL: url, MATOMO_SITE_ID: siteId } = getConfig().publicRuntimeConfig
  
  useEffect(() => {
    const _paq = (window._paq = window._paq || [])
    const script = document.createElement("script")
    script.async = true
    script.src = `${url}piwik.min.js`
    script.type = "text/javascript"

    // This means no tracking or cookies unless consent is given.
    _paq.push(['requireConsent'])

    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["setCookieDomain", "*.tyollisyyspalvelut.hel.fi"])

    _paq.push(["trackPageView"])

    _paq.push(["enableLinkTracking"])
    _paq.push(["setTrackerUrl", `${url}tracker.php`])
    _paq.push(["setSiteId", siteId])

    // This needs to be set to have any tracking or cookies from matomo.
    if (cookieConsent === "true") {
      _paq.push(['setConsentGiven'])
    }

    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }

  }, [cookieConsent])
}

export const useReactAndShare = (
  cookieConsent: string,
  lang: string | undefined,
  pageTitle: string | undefined
) => {
  useEffect(() => {
    if (cookieConsent !== 'true') {
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
    script.src = resourceUrl;
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
