import axios from 'axios'
import qs from 'qs'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { DrupalMenuLinkContent } from 'next-drupal'

import { getDrupalClient } from '@/lib/drupal-client'
import { Tags } from 'src/lib/types'


/** The Client API urls  */
const EVENTS_URL = '/api/events'
const EVENTS_SEARCH_URL = '/api/events-search'

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

// export async function getMenu(name: string): Promise<DrupalMenuLinkContent[]> {
//   const drupal = getDrupalClient()

//   const menu = await drupal.getMenu(name, {
//     // Cache resource during build.
//     withCache: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
//     cacheKey: `tyollisyyspalvelut-ui-menu:${name}`,
//   })

//   return menu.items
// }
