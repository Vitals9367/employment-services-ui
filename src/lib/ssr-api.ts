import { getResourceCollection, getResourceByPath, Locale, translatePath } from 'next-drupal'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { EventsQueryParams } from '@/lib/types'
import { baseEventQueryParams, baseArticlePageQueryParams, baseTprUnitQueryParams } from './params'

export const getEvents = async (queryParams: EventsQueryParams) => {
  const { tags, locationId } = queryParams
  const defaultLocale: Locale = 'fi'
  const locale: Locale = queryParams.locale != undefined ? queryParams.locale : defaultLocale

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

    return await getResourceCollection(NODE_TYPES.EVENT, { 
      locale,
      defaultLocale,
      params: filteredEventParams() 
    })
  }

  if (tags) {
    const filteredEventParams = () =>
      eventParams()
        .addFilter('field_tags', tags, 'IN')
        .getQueryObject()

    return await getResourceCollection(NODE_TYPES.EVENT, { 
      locale,
      defaultLocale,
      params: filteredEventParams() 
    })
  }

  if (locationId) {
    const filteredEventParams = () =>
      eventParams()
        .addFilter('field_location_id', locationId)
        .getQueryObject()

    return await getResourceCollection(NODE_TYPES.EVENT, { 
      locale,
      defaultLocale,
      params: filteredEventParams() 
    })
  }

  return await getResourceCollection(NODE_TYPES.EVENT, { 
    locale,
    defaultLocale,
    params: eventParams().getQueryObject() 
  })
}

export const getNews = async (shortList: string, locale: Locale) => {
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

/**
 * @TODO These may be better solution to fetch translated path for Events.
 */
export const getByPath = async (path: string) => {
  return await getResourceByPath(path)
}

export const getTranslatedPath = async (path: string) => {
  return await translatePath(path)
}