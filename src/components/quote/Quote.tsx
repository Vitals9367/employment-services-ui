import React from "react"
import { DrupalFormattedText } from 'src/lib/types'
import styles from './quote.module.scss'

interface QuoteProps {
  field_quote_content: DrupalFormattedText
  field_quote_author_first_name: DrupalFormattedText
  field_quote_author_last_name: DrupalFormattedText
  field_quote_author_title: DrupalFormattedText
}

function Quote(props: QuoteProps): JSX.Element {
  const {
    field_quote_content,
    field_quote_author_first_name,
    field_quote_author_last_name,
    field_quote_author_title,
  } = props

  let quoteAuthor = ''

  if (field_quote_author_first_name) {
    quoteAuthor += field_quote_author_first_name
  }
  if (field_quote_author_last_name) {
    quoteAuthor += ` ${field_quote_author_last_name}`
  }
  if (field_quote_author_title) {
    quoteAuthor += `, ${field_quote_author_title}`
  }

  return (
    <div className="component">
      <div className={styles.quoteContainer}>
        <figure >
          <blockquote className={styles.quoteContent}>
            {field_quote_content && (
              <p>&ldquo;{field_quote_content}&rdquo;</p>
            )}
          </blockquote>
          <figcaption>
            <cite className={styles.quoteAuthor}>
              {quoteAuthor.length > 1 &&(
                `- ${quoteAuthor}`
              )}
            </cite>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

export default Quote
