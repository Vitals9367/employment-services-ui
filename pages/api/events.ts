import type { NextApiRequest, NextApiResponse } from 'next'
import { getEvents } from '@/lib/ssr-api'
import { EventsQueryParams } from '@/lib/types'
import qs from "qs";

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const query: any = req?.query
  const queryParams: EventsQueryParams = qs.parse(query)

  let events: any = []
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400).json(events)
    return
  }

  events = await getEvents(queryParams).catch((e) => {
    console.log('Error fetching events from Drupal: ', e)
    throw e
  })

  res
    .status(200)
    .json(events)
}
