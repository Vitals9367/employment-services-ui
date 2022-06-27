import getConfig from 'next/config'
import { DrupalClient } from 'next-drupal'

export const getDrupalClient = () => {
  const { NEXT_PUBLIC_DRUPAL_BASE_URL, DRUPAL_PREVIEW_SECRET, DRUPAL_CLIENT_ID, DRUPAL_CLIENT_SECRET } = getConfig().serverRuntimeConfig
  return new DrupalClient(
    NEXT_PUBLIC_DRUPAL_BASE_URL,
    {
      previewSecret: DRUPAL_PREVIEW_SECRET,
      auth: {
        clientId: DRUPAL_CLIENT_ID,
        clientSecret: DRUPAL_CLIENT_SECRET
      }
    }
  )
}
