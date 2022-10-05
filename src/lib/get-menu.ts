import { getDrupalClient } from '@/lib/drupal-client'

export default async function getMenu(name: string, locale: string, defaultLocale: string) {
  const drupal = getDrupalClient()

  const menu = await drupal.getMenu(name, {
    locale,
    defaultLocale,
    withCache: false
  })

  return menu
}
