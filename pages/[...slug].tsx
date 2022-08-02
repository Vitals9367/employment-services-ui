import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { GetStaticPropsContext, GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsResult } from 'next'
import getConfig from 'next/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Locale } from "next-drupal"

import { getCookieConsentValue } from "react-cookie-consent"
import { Container } from 'hds-react'

import NodeBasicPage from '@/components/pageTemplates/NodeBasicPage'
import NodeLandingPage from '@/components/pageTemplates/NodeLandingPage'
import NodeEventPage from '@/components/pageTemplates/NodeEventPage'
import NodeArticlePage from '@/components/pageTemplates/NodeArticlePage'
import { Layout } from '@/components/layout/Layout'

import { getDrupalClient } from "@/lib/drupal-client"
import getMenu from '@/lib/get-menu'
import { Node } from '@/lib/types'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { getQueryParamsFor } from '@/lib/params'
import { NavProps, FooterProps } from "@/lib/types"
import { getBreadCrumb, getLanguageLinks } from '@/lib/helpers'
import { useReactAndShare } from '@/hooks/useAnalytics'

interface PageProps {
  node: Node
  nav: NavProps
  footer: FooterProps
}

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const drupal = getDrupalClient()
  const types = Object.values(NODE_TYPES)
  const paths = await drupal.getStaticPathsFromContext(types, context)

  return {
    paths: paths,
    fallback: true
  }
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PageProps>> {
  const { REVALIDATE_TIME } = getConfig().serverRuntimeConfig
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }
  let withAuth = false

  // Use auth with preview to see unpublished content.
  if (context.preview) {
    withAuth = true
  }
  
  const drupal = getDrupalClient(withAuth)

  const path = await drupal.translatePathFromContext(context)
  const type = path?.jsonapi?.resourceName

  if (!type) {
    return {
      notFound: true,
      revalidate: 3
    }
  }

  const node = await drupal.getResourceFromContext<Node>(type, context, {
    params: getQueryParamsFor(type),
  })

  // Return 404 if node was null
  if (!node || node?.notFound || (!context.preview && node?.status === false)) {
    return {
      notFound: true,
      revalidate: 3
    }
  }

  const langLinks = await getLanguageLinks(node)

  const { tree: menu, items: menuItems } = await getMenu('main', locale, defaultLocale)
  const { tree: themes } = await getMenu('additional-languages', locale, defaultLocale)
  const { tree: footerNav } = await getMenu('footer', locale, defaultLocale)

  const breadcrumb = getBreadCrumb(menuItems, node?.path.alias, node?.title)

  return {
    props: {
      node,
      nav: {
        locale,
        menu,
        themes,
        langLinks,
        breadcrumb,
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

export default function Page({ node, nav, footer }: PageProps) {
  const router = useRouter()
  const [cookieConsent] = useState<string>(getCookieConsentValue('tyollisyyspalvelut_cookie_consent'))
  useReactAndShare(cookieConsent, router.locale, node && node.title)

  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />
  }

  if (!node) return null

  return (
    <Layout header={nav} footer={footer}>
      <Head>
        <title>{node.title}</title>
        <meta name="description" content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      { node.type === NODE_TYPES.PAGE && (
        <NodeBasicPage node={node} sidebar={nav} />
      )}
      { node.type === NODE_TYPES.LANDING_PAGE && (
        <NodeLandingPage node={node} />
      )}
      { node.type === NODE_TYPES.EVENT && (
        <NodeEventPage node={node} />
      )}
      { node.type === NODE_TYPES.ARTICLE && (
        <NodeArticlePage node={node} />
      )}
      {/* React and share */}
      <Container className="container">
        <div className="rns component" />
      </Container>
    </Layout>
  )
}
