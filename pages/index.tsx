import Head from "next/head"
import { GetStaticPropsContext, GetStaticPropsResult } from "next"
import { DrupalNode, getResourceCollectionFromContext, getResourceByPath } from "next-drupal"
import { Layout } from "@/components/layout/Layout"

interface HomePageProps {
  node: DrupalNode
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<HomePageProps>> {
  const { locale } = context
  const node = await getResourceByPath<DrupalNode>(`${locale}/landingpage`);

  return {
    props: {
      node
    },
    //revalidate: 10,
  }
}

export default function HomePage({ node }: HomePageProps) {
  return (
    <Layout>
      <Head>
        <title>Next.js for Drupal</title>
      </Head>
      <div>
        {node ? (
            <div key={node.id}>
              <h1>{node.title}</h1>
            </div>
        ) : (
          <p>No landing page found</p>
        )}
      </div>
    </Layout>
  )
}

