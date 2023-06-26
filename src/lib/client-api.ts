import axios from 'axios'
import qs from 'qs'

import { EventsQueryParams } from '@/lib/types'
import { Locale } from 'next-drupal'

/** The Client API urls  */
const EVENTS_URL = '/api/events'
const EVENTS_SEARCH_URL = '/api/events-search'
const EVENTS_TAGS_URL = '/api/events-tags'
const NEWS_URL = '/api/news'
const UNITS_URL = '/api/units'
const SEARCH_URL = '/api/search'
const SEARCH_SUGGEST_URL = '/api/search-suggest'

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

export const getEventsSearch = async (eventsIndex: number, filter: string | null, locale: Locale) => {
  const { data } = await axios(`${EVENTS_SEARCH_URL}`, { params: { index: eventsIndex, filter: filter, locale: locale } })
  return data
}

export const getNews = async (shortList: boolean, newsFilter: string, locale: Locale) => {
  const { data } = await axios(`${NEWS_URL}`, { params: { limit: shortList, filter: newsFilter, locale: locale } })
  return data
}

export const getUnits = async (locale: Locale) => {
  const { data } = await axios(`${UNITS_URL}`, { params: { locale: locale } })
  return data
}

export const getSearch = async (index: number, query: string | undefined, locale: Locale) => {
  const { data } = await axios(`${SEARCH_URL}`, { params: { index: index, q: query, locale: locale } })
  return data
}

export const getEventsTags = async (locale: Locale) => {
  const { data } = await axios(`${EVENTS_TAGS_URL}`, { params: { locale: locale}})
  return data
}

export const getSearchSuggestions = async (query: string | undefined, locale: Locale) => {
  const { data } = await axios(`${SEARCH_SUGGEST_URL}`, { params: { q: query, locale: locale } })
  return data
}
