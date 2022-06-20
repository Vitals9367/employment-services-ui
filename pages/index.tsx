import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Locale, getMenu, getResourceByPath } from 'next-drupal'

import getConfig from 'next/config'
import ErrorPage from 'next/error'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { Layout } from '@/components/layout/Layout'
import NodeLandingPage from '@/components/pageTemplates/NodeLandingPage'
import { Node, NavProps, FooterProps } from '@/lib/types'
import { getQueryParamsFor } from '@/lib/params'

interface HomePageProps {
  node: Node
  nav: NavProps
  footer: FooterProps
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomePageProps>> {
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }
  const { REVALIDATE_TIME } = getConfig().serverRuntimeConfig

  const node = await getResourceByPath<Node>(getConfig().publicRuntimeConfig.DRUPAL_FRONT_PAGE, {
    locale,
    defaultLocale,
    params: getQueryParamsFor(NODE_TYPES.LANDING_PAGE)
  })

  if (!node || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
      revalidate: 3
    }
  }

  const langLinks = { fi: '/', en: '/en', sv: '/sv'}
  const { tree: menu } = await getMenu('main', {locale, defaultLocale})
  const { tree: themes } = await getMenu('additional-languages')
  const { tree: footerNav } = await getMenu("footer")

  return {
    props: {
      node,
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

export default function HomePage({ node, nav, footer }: HomePageProps) {
  if (!node) return <ErrorPage statusCode={404} />

  return (
    <Layout header={nav} footer={footer}>
      <NodeLandingPage node={node} />
    </Layout>
  )
}
