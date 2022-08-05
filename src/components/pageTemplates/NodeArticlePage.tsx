import { Container } from 'hds-react'
import { Node } from '@/lib/types'
import dateformat from 'dateformat'
import ContentMapper from '@/components/ContentMapper'

import styles from './articlePage.module.scss'

interface NodeArticlePageProps {
  node: Node
}

export function NodeArticlePage({ node, ...props }: NodeArticlePageProps): JSX.Element {
  const { title, field_lead, created, field_content} = node
  return (
    <article>
      <Container className="container content-region">
        <div className={styles.newsArticle}>
          <h1>{title}</h1>
          {field_lead && (
            <div className='lead-in'>{field_lead}</div>
          )}
          <div className={styles.pageDivider}></div>
          {created && (
            <p className={styles.articleDate}><time dateTime={created}>{`${dateformat(created, 'dd.mm.yyyy')}`}</time></p>
          )}
          {field_content?.length > 0 && (
            <ContentMapper content={node.field_content}/>
          )}
        </div>
      </Container>
    </article>
  )
}

export default NodeArticlePage
