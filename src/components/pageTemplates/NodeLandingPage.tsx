import { Container } from 'hds-react'
import { Node } from '@/lib/types'
import ContentMapper from '@/components/ContentMapper'
import Hero from '@/components/hero/Hero'

interface NodeLandingPageProps {
  node: Node
}

function NodeLandingPage({ node, ...props }: NodeLandingPageProps): JSX.Element {
  const { title, field_content, field_hero, field_notification} = node

  return (
    <article>
      {field_hero && (
        <Hero title={title} {...field_hero} />
      )}
      <div className="columns">
        <div className="col-12">
        {field_notification?.length > 0 && (
            <ContentMapper content={node.field_notification}/>
          )}
          {!field_hero &&(
            <Container className="container">
              <h1>{title}</h1>
            </Container>
          )}
          {field_content?.length > 0 && (
            <ContentMapper content={node.field_content}/>
          )}
        </div>
      </div>
    </article>
  )
}

export default NodeLandingPage
