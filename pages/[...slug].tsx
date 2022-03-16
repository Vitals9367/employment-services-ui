import { useRouter } from 'next/router'
import Head from "next/head"
import ErrorPage from 'next/error'

import { GetStaticPropsContext, GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsResult } from "next"

import {
  DrupalNode,
  DrupalParagraph,
  getPathsFromContext,
  getResource,
  getResourceFromContext,
  getResourceTypeFromContext,
} from "next-drupal"

import { Layout } from "@/components/layout"
import NodeBasicPage from "@/components/node-basic-page"

interface PageProps {
  node: DrupalNode
}

export default function Page({ node }: PageProps) {
  const router = useRouter()
  if (!router.isFallback && !node?.id) {
    return <ErrorPage statusCode={404} />
  }

  if (!node) return null

  return (
    <Layout>
      <Head>
        <title>{node.title}</title>
        <meta name="description" content="A Next.js site powered by a Drupal backend."
        />
      </Head>
      {node.type === "node--page" && (
        <NodeBasicPage node={node} />
      )}
    </Layout>
  )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PageProps>> {

  const { locale: prefix } = context
  const type = await getResourceTypeFromContext(context, {
    prefix,
  })

  if (!type) {
    return {
      notFound: true,
    }
  }

  let params = {}

  const node = await getResourceFromContext<DrupalNode>(type, context, {
    prefix,
    params,
  })

  if (!node?.status) {
    return {
      notFound: true,
    }
  }

  if(node.field_content && node.field_content.length > 0) {
    const field_content = node?.field_content.map((paragraph: any) => {
      return getResource<DrupalParagraph>(paragraph.type, paragraph.id)
    })
    node.field_content = await Promise.all(field_content)
  }

  if(node.field_page_content && node.field_page_content.length > 0) {
    const field_page_content = node?.field_page_content.map((paragraph: any) => {
      return getResource<DrupalParagraph>(paragraph.type, paragraph.id)
    })
    node.field_page_content = await Promise.all(field_page_content)
  }

  if(node.field_sidebar_content && node.field_sidebar_content.length > 0) {
    const field_sidebar_content = node?.field_sidebar_content.map((paragraph: any) => {
      return getResource<DrupalParagraph>(paragraph.type, paragraph.id)
    })
    node.field_sidebar_content = await Promise.all(field_sidebar_content)
  }

  return {
    props: {
      node
    },
    revalidate: 1,
  }
}


export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const paths = await getPathsFromContext(['node--page', 'node--article', 'node--landing_page'], context)
  return {
    paths: paths,
    fallback: 'blocking',
  }
}
