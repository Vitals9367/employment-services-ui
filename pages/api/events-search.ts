import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch'
import { EventState, EventData } from '@/lib/types'

type Data = EventState

interface Index {
  [key: string]: string | string[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400)
    return
  }

  const { index }: Index = req?.query

  if (isNaN(Number(index))) {
    res.status(400)
    return
  }

  const elastic = Elastic.getElasticClient()

  const body = {
    size: 9,
    from: (9*Number(index)),
    query: {
      match_all: {}
    }
  }

  try {
    const searchRes = await elastic.search({
      index: 'events_fi',
      body: body,
      sort: "field_end_time:asc"
    })

    const {
      hits: { total, hits }
    } = searchRes as any

    res.json({
      total: total?.value,
      events: hits.map((hit: any) => {
        const { title, url, field_image_url, field_image_alt, field_start_time, field_end_time, field_location, field_tags } = hit._source as EventData
        return { title, url, field_image_url, field_image_alt, field_start_time, field_end_time, field_location, field_tags }
      }),
    })
  } catch (err) {
    console.log('err', err)
    res.status(500)
  }
}
