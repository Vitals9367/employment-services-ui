import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import getConfig from 'next/config'
import { Linkbox, Button as HDSButton, IconPlus, IconCrossCircle, IconArrowRight } from 'hds-react'

import { DrupalFormattedText, EventState } from '@/lib/types'
import { getEvents, getEventsSearch } from '@/lib/client-api'
import { eventTags } from '@/lib/helpers'

import HtmlBlock from '@/components/HtmlBlock'
import TagList from './TagList'
import DateTime from './DateTime'

import styles from './events.module.scss'

interface EventListProps {
  field_title: string
  field_events_list_short: boolean
  field_event_tag_filter: string[]
  field_events_list_desc:  DrupalFormattedText
}

export function EventList(props: EventListProps): JSX.Element {
  const { field_title, field_events_list_short, field_event_tag_filter: tags, field_events_list_desc } = props
  const { t } = useTranslation()
  const fetcher = () => getEvents({ tags })
  const { locale, asPath } = useRouter()
  const { data: events, error } = useSWR(
    `/${locale}/${asPath}`,
    fetcher
  )

  return (
    <div className='component'>
        <div className={styles.eventListTitleArea}>
          {field_title && 
            <h2>{field_title}</h2>
          }
          {field_events_list_short && 
            <a href={t('list.events_page_url')}>{t('list.show_all_events')} <IconArrowRight size="l" /></a>
          }
        </div>

      {field_events_list_desc?.processed &&
        <div className={styles.eventListDescription}>
          <HtmlBlock field_text={field_events_list_desc} />
        </div>
      }
      <div className={`${styles.eventList} ${field_events_list_short && styles.short}`}>
        { events && events.map((event: any, key: any) => (
          <div className={styles.eventCard} key={key}>
            <Linkbox
              className={styles.linkBox}
              linkboxAriaLabel="List of links Linkbox"
              linkAriaLabel="Linkbox link"
              key={key}            
              href={`${event.path.langcode}${event.path.alias}`}
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
              <div className={styles.eventCardContent}>
                {event.field_tags && event.field_tags.length !== 0 && <TagList tags={event.field_tags} /> }
                <DateTime startTime={event.field_start_time} endTime={event.field_end_time} />
                <h3>{event.title}</h3>
                <p>{event.field_location}</p>
              </div>
            </Linkbox>
          </div>
        ))}
      </div>
    </div>
  )
}

const getKey = (eventsIndex: number) => {
  return `${eventsIndex}`
}

export function EventListWithFilters(props: EventListProps): JSX.Element {
  const { field_title, field_events_list_desc } = props
  const { t } = useTranslation()
  const fetcher = (eventsIndex: number) => getEventsSearch(eventsIndex)
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)
  const [filter, setFilter] = useState<any | null>(t('search.clear'))
  const [filteredEvents, setFilteredEvents] = useState<EventState>()

  const drupalBaseUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_DRUPAL_BASE_URL
  const events = data && data.reduce((acc:any, curr:any) => acc.concat(curr.events), [])
  const total: Number = data && data.reduce((acc:any, r:any) => (r.total), 0)

  const loadMoreText = t('list.load_more')
  const resultsText = t('list.results_text')

  useEffect(() => {
    const filterEvents = () => {
      const filtered = filter !== t('search.clear') ? events.filter((event: any) => event.field_tags.includes(filter)) : events
      const fe: EventState = {
        total: filtered && filtered.length,
        events: filtered
      }
      setFilteredEvents(fe)
    }
    filterEvents()
  }, [filter, data]) // eslint-disable-line

  let tags = events && events.reduce((acc:any, curr:any) => {
    return [...acc, curr.field_tags]
  }, [])

  tags = tags && tags.flat().filter((value:any, index:any, array:any) => { 
    return array.indexOf(value) === index
  })
  // Prioritise tags order by eventTags.
  tags && tags.sort((a: string, b: string) => eventTags.indexOf(a) - eventTags.indexOf(b))
  const finalTags = tags && tags.map((tag: string) => tag.replace('_', ' '))
  finalTags && finalTags.push(t('search.clear'))

  const getEventUrl = (url: string) => {
    const eventPath = url.replace(`${drupalBaseUrl}/tapahtumat`, '')
    return (`${t('list.events_page_url')}${eventPath}`)
  }

  return (
    <div className='component'>
      {field_title && 
        <h2>{field_title}</h2>
      }
      {field_events_list_desc?.processed &&
        <div className={styles.eventListDescription}>
          <HtmlBlock field_text={field_events_list_desc} />
        </div>
      }
      <div className={styles.results}>
        {filter !== t('search.clear') ? `${filteredEvents?.total} / ${total} ${resultsText}` : `${total} ${resultsText}`}
      </div>
      <div className={styles.filter}>{t('search.filter')}</div>
      <div className={styles.filterTags}>
        {finalTags && Object.values(finalTags).map((tag: any, i: number) => (
          tag === t('search.clear') ? (
            <HDSButton
              key={`tagFilter-${i}`}
              variant="supplementary"
              iconLeft={<IconCrossCircle />}
              className={styles.supplementary}
              onClick={() => {setFilter(tag)}}
            >
              {tag}
            </HDSButton>
          )
          : (
            <HDSButton
              key={`tagFilter-${i}`}
              className={filter === tag ? styles.selected: styles.filterTag}
              onClick={() => {setFilter(tag.replace(' ', '_'))}}
            >
              {tag}
            </HDSButton>
          )
        ))}
      </div>
      <div className={styles.eventList}>
        { filteredEvents?.events && filteredEvents.events.map((event: any, key: any) => (
          <div className={styles.eventCard} key={key}>
            <Linkbox
              className={styles.linkBox}
              linkboxAriaLabel="List of links Linkbox"
              linkAriaLabel="Linkbox link"
              key={key}            
              href={getEventUrl(event.url[0])}
              withBorder
            >
              <Image
                src={event.field_image_url[0]}
                alt={event.field_image_alt[0]}
                layout='responsive'
                objectFit='cover'
                width={384}
                height={158}
              />
              <div className={styles.eventCardContent}>
                {event.field_tags && event.field_tags.length !== 0 && <TagList tags={event.field_tags} /> }
                <DateTime startTime={event.field_start_time[0]} endTime={event.field_end_time[0]} />
                <h3>{event.title[0]}</h3>
                <p>{event.field_location[0]}</p>
              </div>
            </Linkbox>
          </div>
        ))}
      </div>
      {events && total > events.length && (
        <div className={styles.loadMore}>
          <HDSButton
            variant='supplementary'
            iconRight={<IconPlus />}
            style={{ background: 'none' }}
            onClick={() => {
              setSize(size + 1)
            }}
          >
            {loadMoreText}
          </HDSButton>
        </div>
      )}
    </div>
  )
}
