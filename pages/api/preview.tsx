// import type { NextApiRequest, NextApiResponse } from 'next'
import { getDrupalClient } from '@/lib/drupal-client'


export default async function (
  // TODO: add types back after next-drupal is updated
  // request: NextApiRequest,
  // response: NextApiResponse,
  request: any,
  response: any
  ) {
  const drupal = getDrupalClient()
  return await drupal.preview(request, response)
}
