import useSWR from 'swr'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Linkbox } from 'hds-react'

import { DrupalFormattedText } from '@/lib/types'
import { getEvents } from '@/lib/client-api'

import HtmlBlock from '@/components/HtmlBlock'
import TagList from './TagList'
import DateTime from './DateTime'

import styles from './events.module.scss'

interface EventListProps {
  field_title: string
  field_event_tag_filter: any
  field_events_list_desc:  DrupalFormattedText
}

function EventList(props: EventListProps): JSX.Element {
  const { field_title, field_event_tag_filter: tags, field_events_list_desc } = props
  const fetcher = () => getEvents({ tags })
  const { locale, asPath } = useRouter()
  const { data: events, error } = useSWR(
    `/${locale}/${asPath}`,
    fetcher
  )

  return (
    <div className='component'>
      {field_title && 
        <h2>{field_title}</h2>
      }
      {field_events_list_desc?.processed && 
        <HtmlBlock field_text={field_events_list_desc} />
      }
      <div className={styles.eventList}>
        { events && events.map((event: any, key: any) => (
          <div className={styles.eventCard} key={key}>
            <Linkbox
              className={styles.linkBox}
              linkboxAriaLabel="List of links Linkbox"
              linkAriaLabel="Linkbox link"
              key={key}            
              href={`${event.path.langcode}/tapahtumat/${event.path.alias}`}
              withBorder
            >
              <Image
                src={event.field_image_url}
                alt=''
                layout='responsive'
                objectFit='cover'
                width={384}
                height={158}
              />
              {event.field_tags && event.field_tags.length !== 0 && <TagList tags={event.field_tags} /> }
              <DateTime startTime={event.field_start_time} endTime={event.field_end_time}  />
              <div className={styles.eventCardContent}>
                <h3>{event.title}</h3>
                <p>{event.field_location}</p>
              </div>
            </Linkbox>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
