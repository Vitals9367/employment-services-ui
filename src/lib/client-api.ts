import axios from 'axios'
import qs from 'qs'

import { Tags } from '@/lib/types'

/** The Client API urls  */
const EVENTS_URL = '/api/events'
const EVENTS_SEARCH_URL = '/api/events-search'
const NEWS_URL = '/api/news'

export const getEvents = async (tags: Tags) => {
  const { data } = await axios(`${EVENTS_URL}`, {
    params:
      tags,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })

  return data
}

export const getEventsSearch = async (eventsIndex: number) => {
  const { data } = await axios(`${EVENTS_SEARCH_URL}`, { params: { index: eventsIndex } })
  return data
}

export const getNews = async (shortList: boolean) => {
  const { data } = await axios(`${NEWS_URL}`, { params: { limit: shortList } })
  return data
}

