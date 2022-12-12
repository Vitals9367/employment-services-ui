import axios from 'axios'
import qs from 'qs'

import { EventsQueryParams } from '@/lib/types'
import { Locale } from 'next-drupal'

/** The Client API urls  */
const EVENTS_URL = '/api/events'
const EVENTS_SEARCH_URL = '/api/events-search'
const NEWS_URL = '/api/news'
const UNITS_URL = '/api/units'

export const getEvents = async (queryParams: EventsQueryParams) => {
  const { data } = await axios(`${EVENTS_URL}`, {
    params:
      queryParams,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })

  return data
}

export const getEventsSearch = async (eventsIndex: number, filter: string | null) => {
  const { data } = await axios(`${EVENTS_SEARCH_URL}`, { params: { index: eventsIndex, filter: filter } })
  return data
}

export const getNews = async (shortList: boolean, locale: Locale) => {
  const { data } = await axios(`${NEWS_URL}`, { params: { limit: shortList, locale: locale } })
  return data
}

export const getUnits = async (locale: Locale) => {
  const { data } = await axios(`${UNITS_URL}`, { params: { locale: locale } })
  return data
}

