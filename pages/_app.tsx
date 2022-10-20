import '../styles/globals.scss'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { getCookieConsents } from '@/hooks/useAnalytics'
import { CookieModal } from 'hds-react';

export const MyApp = ({ Component, pageProps }: AppProps) => {
  const contentSource = getCookieConsents()
  
  return (
    <>
      <CookieModal contentSource={contentSource} />
      <Component {...pageProps} />
    </>
  );
};

export default appWithTranslation(MyApp)
