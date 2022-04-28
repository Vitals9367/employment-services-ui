import { Container } from 'hds-react'
import ContentMapper from '../ContentMapper'

interface NodeBasicPageProps {
  node: any
}

export function NodeBasicPage({ node, ...props }: NodeBasicPageProps): JSX.Element {
  return (
    <article>
      <Container className="container">
        <div className="columns">
          <div className="content-region col col-8 flex-grow">
            <h1>{node.title}</h1>
            {node.body?.processed && (
              <div
                dangerouslySetInnerHTML={{ __html: node.body?.processed }}
              />
            )}

            {node.field_content?.length > 0 && (
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
