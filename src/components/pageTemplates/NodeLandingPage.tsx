import { Container } from 'hds-react'
import { Node } from 'src/lib/types'
import ContentMapper from '@/components/ContentMapper'

interface NodeLandingPageProps {
  node: Node
}

export function NodeLandingPage({ node, ...props }: NodeLandingPageProps): JSX.Element {
  const { title, field_lead_in, field_content} = node

  return (
    <article>
      <Container className="container">
        <div className="columns">
          <div className="col-12">
            <h1>{title}</h1>

            {field_lead_in && (
              <div className='lead-in'>{field_lead_in}</div>
            )}

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
