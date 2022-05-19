import { Container } from 'hds-react'
import { Node } from 'src/lib/types'
import ContentMapper from '@/components/ContentMapper'
import Hero from '@/components/hero/Hero'

interface NodeLandingPageProps {
  node: Node
}

export function NodeLandingPage({ node, ...props }: NodeLandingPageProps): JSX.Element {
  const { title, field_hero, field_content} = node

  return (
    <article>
      {field_hero && (
        <Hero title={title} {...field_hero} />
      )}
      <Container className="container">
        <div className="columns">
          <div className="col-12">
            {field_content?.length > 0 && (
              <ContentMapper content={node.field_content}/>
            )}
          </div>
        </div>
      </Container>
    </article>
  )
}

export default NodeLandingPage
