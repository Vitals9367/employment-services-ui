import type { NextApiRequest, NextApiResponse } from 'next'
import { getEvents } from '@/lib/ssr-api'
import { Tags } from 'src/lib/types'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const tags: Tags = req?.query
  
  let events: any = []
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400).json(events)
    return
  }

  events = await getEvents(tags).catch((e) => {
    console.log('Error fetching events from Drupal: ', e)
    throw e
  })

  res
    .status(200)
    .json(events)
}
