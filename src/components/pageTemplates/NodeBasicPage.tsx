import { Container } from 'hds-react'
import { Node } from 'src/lib/types'
import ContentMapper from '@/components/ContentMapper'

interface NodeBasicPageProps {
  node: Node
}

export function NodeBasicPage({ node, ...props }: NodeBasicPageProps): JSX.Element {
  // console.log({node})
  const { title, field_lead_in, field_content} = node

  return (
    <article>
      <Container className="container">
        <div className="columns">
          <div className="content-region col col-8 flex-grow">
            <h1>{title}</h1>

            {field_lead_in && (
              <div className='lead-in'>{field_lead_in}</div>
            )}

            {field_content?.length > 0 && (
              <ContentMapper content={node.field_content}/>
            )}
          </div>
          <div className="sidebar col col-4 flex-order-first">
            Sidebar
          </div>
        </div>
        <div className="columns">
          <div className="lower-content-region col col-12">
            Lower content region placeholder
          </div>
        </div>
      </Container>
    </article>
  )
}

export default NodeBasicPage
