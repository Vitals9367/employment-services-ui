import { getResourceCollection, getResourceByPath, Locale, translatePath, DrupalClient, DrupalTranslatedPath } from 'next-drupal'
import { GetStaticPropsContext } from 'next'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { EventsQueryParams, Node } from '@/lib/types'
import { baseEventQueryParams, baseArticlePageQueryParams, baseTprUnitQueryParams, getQueryParamsFor } from '@/lib/params'

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
        .addFilter("status", "1")
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
      .addFilter("status", "1")
      .addFilter('langcode', locale)

  return await getResourceCollection(NODE_TYPES.ARTICLE, {
    locale,
    defaultLocale,
    params: newsParams().getQueryObject()
  })
}

export const getUnits = async (locale: Locale) => {
  const defaultLocale: Locale = 'fi'

  const unitsParams = () =>
    baseTprUnitQueryParams()
      .addFilter('menu_link', null, 'IS NOT NULL')
      .addSort('name_override', 'ASC')

  return await getResourceCollection(NODE_TYPES.TPR_UNIT, {
    locale,
    defaultLocale,
    params: unitsParams().getQueryObject() })
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

interface GetNodeProps {
  type: string
  context: GetStaticPropsContext
  drupal: DrupalClient
  path: DrupalTranslatedPath
  retry?: number
}

const RETRY_LIMIT = 10
export const getNode = async (props: GetNodeProps) => {
  const { type, context, drupal, path, retry = 0 } = props

  const getter: any = () =>
    drupal.getResourceFromContext<Node>(type, context, {
      params: getQueryParamsFor(type),
    })
    .catch((e: any) => {
      console.log(`Error requesting node %s`, path.entity.path, {
        type,
        e,
      })
      return null
    })

  if (retry < 1) {
    return getter()
  }

  let node = null
  let attempts = 0
  while (node === null && attempts <= retry - 1 && attempts <= RETRY_LIMIT) {
    if (attempts > 0) {
      console.log('Retry attempts %s for %s', attempts, path.entity.path)
      await new Promise((res) => setTimeout(res, 1000))
    }

    node = await getter()
    attempts++
  }
  if (!node) {
    console.log(
      'Unable to get page %s after %s attempts',
      path.entity.path,
      attempts
    )
    throw `Unable to get page ${path.entity.path} after ${retry} attempts`
  }

  return node
}
