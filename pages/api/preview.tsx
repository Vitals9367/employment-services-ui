import type { NextApiRequest, NextApiResponse } from 'next'
import { getDrupalClient } from '@/lib/drupal-client'


export default async function (
  request: NextApiRequest,
  response: NextApiResponse
  ) {
  const drupal = getDrupalClient()
  return await drupal.preview(request, response)
}
