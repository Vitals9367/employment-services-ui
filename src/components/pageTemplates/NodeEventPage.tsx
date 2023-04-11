import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Container } from 'hds-react'
import { IconLocation, IconLinkExternal, IconAlertCircle, Button } from 'hds-react'

import { Node } from '@/lib/types'
import HtmlBlock from '@/components/HtmlBlock'
import TagList from '@/components/events/TagList'
import DateTime from '@/components/events/DateTime'
import Link from '@/components/link/Link'
import styles from './eventPage.module.scss'
import EventStatus from '../events/EventStatus'

interface NodeEventPageProps {
  node: Node
}

function NodeEventPage({ node, ...props }: NodeEventPageProps): JSX.Element {
  const { title, field_text, field_location, field_location_id, field_start_time, field_end_time, field_tags, field_image_url, field_image_alt, field_info_url, field_external_links, field_street_address, field_event_status, field_location_extra_info, field_offers_info_url, field_event_tags  } = node
  const { t } = useTranslation('common')
  const { locale } = useRouter()
  const infoUrlText = field_info_url && field_info_url.startsWith('https://teams.microsoft') ? t('event.info_url_text_teams') : t('event.info_url_text');
  const event_tags : string[] = [];
  field_event_tags.map((tag: { name: string }) => event_tags.push(tag.name))

  const onClick = () => {
    location.href = field_offers_info_url;
  }
  return (
    <article>
      <Container className="container">
        <div className="columns">
          <div className="col-12">
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
                {field_tags && field_tags.length !== 0 && <TagList tags={event_tags} /> }
                <h1><EventStatus {...{'field_event_status': field_event_status}} />{title}</h1>
                <DateTime startTime={field_start_time} endTime={field_end_time}  />
                <div className={styles.location}>
                  <div>
                    <IconLocation />
                  </div>
                  <div>
                    { field_street_address
                      ? <a href={`https://palvelukartta.hel.fi/${locale}/unit/${field_location_id}`} target="_blank" rel="noreferrer">{field_location}{field_street_address ? `, ${field_street_address}` : ''}<IconLinkExternal size="s" aria-hidden="true"/></a>
                      : field_location
                    }
                  </div>
                </div>
                { field_location_extra_info &&
                  <div className={styles.location}>
                    <div>
                      <IconAlertCircle size="s" aria-hidden="true" />
                    </div>
                    <div>
                      {field_location_extra_info}
                    </div>
                  </div>
                }
              </div>
            </div>
            <div className={`${styles.contentContainer} content-region`}>
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
            {field_offers_info_url &&
              <Button onClick={onClick} theme="black" iconRight={<IconLinkExternal size="m" aria-hidden="true" />}>
                { t('event.field_offers_info_url') }
              </Button>
            }
          </div>
        </div>
      </Container>
    </article>
  )
}

export default NodeEventPage
