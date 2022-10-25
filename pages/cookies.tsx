import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Locale } from 'next-drupal'
import getConfig from 'next/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Container } from 'hds-react'

import getMenu from '@/lib/get-menu'
import { Layout } from '@/components/layout/Layout'
import { NavProps, FooterProps } from '@/lib/types'

import { CookiePage } from 'hds-react';
import { useCookieConsents } from '@/hooks/useAnalytics';

interface CookiePageProps {
  nav: NavProps
  footer: FooterProps
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<CookiePageProps>> {
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }
  const { REVALIDATE_TIME, DRUPAL_FRONT_PAGE } = getConfig().serverRuntimeConfig  
  const langLinks = { fi: '/', en: '/en', sv: '/sv'}
  const { tree: menu } = await getMenu('main', locale, defaultLocale)
  const { tree: themes } = await getMenu('additional-languages', locale, defaultLocale)
  const { tree: footerNav } = await getMenu('footer', locale, defaultLocale)

  return {
    props: {
      nav: {
        locale,
        menu,
        themes,
        langLinks,
      },
      footer: {
        locale,
        footerNav,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: REVALIDATE_TIME
  }
}

export default function Cookies({ nav, footer }: CookiePageProps) {
  const { t } = useTranslation('common')
  const contentSource = useCookieConsents()

  return (
    <Layout header={nav} footer={footer}>
      <Head>
        <title>{t('site_title')}</title>
      </Head>
      <Container className="container">
        <CookiePage contentSource={contentSource} />
      </Container>
    </Layout>
  )
}
