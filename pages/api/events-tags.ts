import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch'

type Data = any

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400)
    return
  }

  const elastic = Elastic.getElasticClient()

  let response: any = {}
  const body: any = {
    "query": {
      "match_all": {}
    },
    "size": 0,
    "aggs": {
      "events_tags": {
        "terms": {
          "field": "field_tags.keyword",
          "size": 100,
          "order": {
            "_term": "asc"
          }
        }
      }
    }
  }

  try {
    const searchRes = await elastic.search({
      index: 'events_fi',
      body: body
    })

    const { events_tags }: any = searchRes.aggregations

    res.json(events_tags?.buckets)

  } catch (err) {
    console.log('err', err)
    res.status(500)
  }
}
