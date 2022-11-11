import '../styles/globals.scss'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { CookieModal } from 'hds-react';
import { useConsentStatus, useCookieConsents, useMatomo } from '@/hooks/useAnalytics';
import { useRouter } from 'next/router';

export const MyApp = ({ Component, pageProps }: AppProps) => {
  const { isPreview } = useRouter()
  const contentSource = useCookieConsents()

  useMatomo(useConsentStatus('matomo'))

  return (
    <>
      { !isPreview && <CookieModal contentSource={contentSource} /> }
      <Component {...pageProps} />
    </>
  );
};

export default appWithTranslation(MyApp)
