import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { Container } from 'hds-react'
import { IconLocation } from 'hds-react'

import { Node } from '@/lib/types'
import HtmlBlock from '@/components/HtmlBlock'
import TagList from '@/components/events/TagList'
import DateTime from '@/components/events/DateTime'
import Link from '@/components/link/Link'

import styles from './eventPage.module.scss'

interface NodeLandingPageProps {
  node: Node
}

function NodeEventPage({ node, ...props }: NodeLandingPageProps): JSX.Element {
  const { title, field_text, field_location, field_start_time, field_end_time, field_tags, field_image_url, field_image_alt, field_info_url, field_external_links } = node
  const { t } = useTranslation('common')
  const infoUrlText = field_info_url && field_info_url.startsWith('https://teams.microsoft') ? t('event.info_url_text_teams') : t('event.info_url_text')

  return (
    <article>
      <Container className="container">
        <div className="columns">
          <div className="content-region col-12">
            <div className={styles.eventHero}>
              <div className={styles.imageContainer}>
                <Image
                  src={field_image_url}
                  alt={field_image_alt}
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              <div className={styles.headingContainer}>
                {field_tags && field_tags.length !== 0 && <TagList tags={field_tags} /> }
                <h1>{title}</h1>
                <DateTime startTime={field_start_time} endTime={field_end_time}  />
                <div className={styles.location}><IconLocation />{field_location}</div>
              </div>
            </div>
            <div className={styles.contentContainer}>
              {field_text?.processed && 
              <HtmlBlock field_text={field_text} />
              }

              {field_info_url && 
                <Link
                  href={field_info_url}
                  text={infoUrlText}
                />
              }

              { field_external_links.length > 0 && 
                field_external_links.map((externalLink: any, key: any) => (
                  <Link
                    key={key}
                    href={externalLink.uri}
                    text={externalLink.title}
                  />
                ))
              }
            </div>

          </div>
        </div>
      </Container>
    </article>
  )
}

export default NodeEventPage
