import { Container } from 'hds-react'
import { Node } from '@/lib/types'
import dateformat from 'dateformat'
import ContentMapper from '@/components/ContentMapper'

import styles from './articlePage.module.scss'

interface NodeArticlePageProps {
  node: Node
}

export function NodeArticlePage({ node, ...props }: NodeArticlePageProps): JSX.Element {
  const { title, field_lead, created, field_content, langcode, published_at } = node;
  const articleDate = published_at !== null ? published_at : created;

  return (
    <article>
      <Container className="container content-region">
        <div className={styles.newsArticle}>
          <h1>{title}</h1>
          {field_lead && (
            <div className='lead-in'>{field_lead}</div>
          )}
          <div className={styles.pageDivider}></div>
          { articleDate && <p className={styles.articleDate}><time dateTime={articleDate}>{`${dateformat(articleDate, 'dd.mm.yyyy')}`}</time></p>}
          {field_content?.length > 0 && (
            <ContentMapper content={node.field_content} langcode={langcode} />
          )}
        </div>
      </Container>
    </article>
  )
}

export default NodeArticlePage
