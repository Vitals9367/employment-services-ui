import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import getConfig from 'next/config'

import { getDrupalClient } from '@/lib/drupal-client'

export default async function getMenu(name: string, locale: string, defaultLocale: string) {
  const { REDIS_PREFIX } = getConfig().serverRuntimeConfig
  const drupal = getDrupalClient()

  const menu = await drupal.getMenu(name, {
    locale,
    defaultLocale,
    // Cache resource during build.
    withCache: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
    cacheKey: `${REDIS_PREFIX}-menu:${name}`
  })

  return menu
}
