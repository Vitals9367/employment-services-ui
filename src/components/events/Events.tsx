import { getEventsSearch, getEventsTags } from "@/lib/client-api"
import { EventListProps } from "@/lib/types"
import { Linkbox, Button as HDSButton, IconPlus, IconCrossCircle, Container } from "hds-react"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import useSWRInfinite from 'swr/infinite'
import HtmlBlock from "../HtmlBlock"
import Image from 'next/image'

import styles from './events.module.scss'
import DateTime from "./DateTime"
import TagList from "./TagList"
import EventStatus from "./EventStatus"
import { eventTags, getPath } from "@/lib/helpers"
import { useEffect, useState } from "react"

const getKey = (eventsIndex: number) => {
  return `${eventsIndex}`
}

const getEvents = (data: any) => {
  return data.reduce((acc:any, curr:any) => acc.concat(curr.events), [])
}

const getTotal = (data: any) => {
  return {
    'max': data[0].maxTotal ? data[0].maxTotal : data[0].total,
    'current': data[0].total
  }
}

export default function Events(props: EventListProps): JSX.Element {
  const { field_title, field_events_list_desc } = props
  const { t } = useTranslation()
  const { locale } = useRouter()
  const [filter, setFilter] = useState<string | null>(null)

  const fetcher = (eventsIndex: number) => getEventsSearch(eventsIndex, filter)
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)
  const events = data && getEvents(data)
  const total = data && getTotal(data)
  const [ eventsTags, setEventsTags ] = useState<any>([])

  const resultText = !total ? '' : total.current < total.max ? `${total.current} / ${total.max} ${t('list.results_text')}` : `${total.max} ${t('list.results_text')}`

  /**
   * @TODO Check ssr-api.js for maybe better solution via "getResourceByPath" or "translatePath"
   */
  const getLangPath = (event: any): string => {
    const nodePath: string = event.url[0].substring(event.url[0].lastIndexOf('/'))
    const eventPaths: any = {
      'sv': '/sv/aktuellt/evenemang',
      'en': '/en/current-matters/events'
    }

    return locale !== 'fi' && locale != undefined ? `${eventPaths[locale]}${nodePath}` : getPath(event.url[0])
  }

  const updateTags = () => {
    getEventsTags().then((result) => {
      const tags: any = result
        .filter((item: any) => { return item.key === undefined ? false : item })
        .map((item: any) => { return item.key })
        .sort((a: string, b: string) => eventTags.indexOf(a) - eventTags.indexOf(b))
      setEventsTags(tags)
    })
  }


  useEffect(() => {
    updateTags()
  }, [])

  useEffect(() => {
    setSize(1)
  }, [filter]) // eslint-disable-line

  return (
    <div className='component'>
    <Container className='container'>
      { field_title &&
        <h2>{field_title}</h2>
      }

      { field_events_list_desc?.processed &&
        <div className={styles.eventListDescription}>
          <HtmlBlock field_text={field_events_list_desc} />
        </div>
      }

      <div className={styles.results}>
        { resultText }
      </div>

      <div className={styles.filter}>{t('search.filter')}</div>

      <div className={styles.filterTags}>
        { eventsTags && eventsTags.map((tag: any, i: number) => (
          <HDSButton
            key={`tagFilter-${i}`}
            className={filter === tag ? styles.selected: styles.filterTag}
            onClick={() => { setFilter(tag.replace(' ', '_')) }}
          >
          { tag.replace('_', ' ') }
          </HDSButton>
          ))
        }
        <HDSButton
          variant="supplementary"
          iconLeft={<IconCrossCircle />}
          className={styles.supplementary}
          onClick={() => { setFilter(null) }}
        >
          { t('search.clear') }
        </HDSButton>
      </div>

      <div className={styles.eventList}>
        { events && events.map((event: any, key: any) => (
          <div className={styles.eventCard} key={key}>
            <Linkbox
              className={styles.linkBox}
              linkboxAriaLabel="List of links Linkbox"
              linkAriaLabel="Linkbox link"
              key={key}
              href={event.url}
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
                {event.field_tags && event.field_tags.length !== 0 && <TagList tags={event.field_event_tags} /> }
                <DateTime startTime={event.field_start_time[0]} endTime={event.field_end_time[0]} />
                <h3><EventStatus {...event} />{event.title[0]}</h3>
                <p>{event.field_location[0]}{ event.field_street_address ? `, ${event.field_street_address[0]}` : ''}</p>
              </div>
            </Linkbox>
          </div>
        ))}
      </div>

      {events && total && total.current > (size*9) && (
        <div className={styles.loadMore}>
          <HDSButton
            variant='supplementary'
            iconRight={<IconPlus />}
            style={{ background: 'none' }}
            onClick={() => {
              setSize(size + 1)
            }}
          >
            {t('list.load_more')}
          </HDSButton>
        </div>
      )}
    </Container>
  </div>
  )

}
