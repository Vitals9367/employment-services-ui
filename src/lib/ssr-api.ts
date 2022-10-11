import { getResourceCollection, Locale } from 'next-drupal'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { EventsQueryParams } from '@/lib/types'
import { baseEventQueryParams, baseArticlePageQueryParams, baseTprUnitQueryParams } from './params'

export const getEvents = async (queryParams: EventsQueryParams) => {
  const { tags, locationId } = queryParams

  let eventParams = () =>
    baseEventQueryParams()
      .addSort('field_end_time', 'ASC')
      .addPageLimit(3)

  if (tags && locationId) {
    const filteredEventParams = () =>
      eventParams()
        .addFilter('field_tags', tags, 'IN')
        .addFilter('field_location_id', locationId)
        .getQueryObject()

    return await getResourceCollection(NODE_TYPES.EVENT, { params: filteredEventParams() })
  }

  if (tags) {
    const filteredEventParams = () =>
      eventParams()
        .addFilter('field_tags', tags, 'IN')
        .getQueryObject()

    return await getResourceCollection(NODE_TYPES.EVENT, { params: filteredEventParams() })
  }

  if (locationId) {
    const filteredEventParams = () =>
      eventParams()
        .addFilter('field_location_id', locationId)
        .getQueryObject()

    return await getResourceCollection(NODE_TYPES.EVENT, { params: filteredEventParams() })
  }

  return await getResourceCollection(NODE_TYPES.EVENT, { params: eventParams().getQueryObject() })
}

export const getNews = async (shortList: string, langcode: string) => {
  const locale: Locale = langcode
  const defaultLocale: Locale = 'fi'

  if (shortList === 'true') {
    const newsParamsLimited = () =>
      baseArticlePageQueryParams()
        .addSort('created', 'DESC')
        .addPageLimit(4)

    return await getResourceCollection(NODE_TYPES.ARTICLE, { 
      params: newsParamsLimited().getQueryObject(),
      locale,
      defaultLocale
    })
  }

  const newsParams = () =>
    baseArticlePageQueryParams()
      .addSort('created', 'DESC')
      .addFilter('langcode', locale)

  return await getResourceCollection(NODE_TYPES.ARTICLE, { 
    locale,
    defaultLocale,
    params: newsParams().getQueryObject() 
  })
}


export const getUnits = async () => {
  const unitsParams = () =>
    baseTprUnitQueryParams()
      .addFilter('menu_link', null, 'IS NOT NULL')
      .addSort('name_override', 'ASC')

  return await getResourceCollection(NODE_TYPES.TPR_UNIT, { params: unitsParams().getQueryObject() })
}