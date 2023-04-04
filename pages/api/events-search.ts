import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch'
import { EventState, EventData } from '@/lib/types'
import { SearchHit, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
import { getLocale } from '@/lib/helpers'

type Data = EventState

type Index = Partial<{ [key: string]: string | string[] }>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const locale = getLocale(res);
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400)
    return
  }

  const { index, filter }: Index = req?.query

  if (isNaN(Number(index))) {
    res.status(400)
    return
  }

  const elastic = Elastic.getElasticClient()

  let response: any = {}
  const body = {
    size: 9,
    from: (9*Number(index)),
    query: filter ? { match: { field_tags: String(filter) } } : { match_all: {} }
  }

  try {
    const searchRes = await elastic.search({
      index: `events_${locale}`,
      body: body,
      sort: "field_end_time:asc"
    })

    const {
      hits: { total, hits }
    } = searchRes as { hits: { total: SearchTotalHits, hits: SearchHit<unknown>[] }}



    response = {
      ...response,
      total: total?.value,
      events: hits.map((hit: any) => {
        const {
          title,
          url,
          field_image_url,
          field_image_alt,
          field_start_time,
          field_end_time,
          field_location,
          field_tags,
          field_event_tags,
          field_street_address,
          field_event_status,
        } = hit._source as EventData

        return {
          title,
          url,
          field_image_url,
          field_image_alt,
          field_start_time,
          field_end_time,
          field_location,
          field_tags,
          field_event_tags,
          field_street_address,
          field_event_status,
        }
      }),
    }

  } catch (err) {
    console.log('err', err)
    res.status(500)
  }

  /**
   * @TODO Is there better way to get static info about the tags and total amount of all events for filters?
   */
  if (filter) {
    try {
      const searchRes = await elastic.search({
        index: `events_${locale}`,
        body: { query: { match_all: {} } },
        sort: "field_end_time:asc"
      })
      const {
        hits: { total, hits }
      } = searchRes as { hits: { total: SearchTotalHits, hits: SearchHit<unknown>[] }}

      response = { ...response,
        maxTotal: total?.value,
        tags: hits.map((hit: any) => {
          const { field_tags } = hit._source as EventData
          return { field_tags }
        }),
      }

    } catch (err) {
      console.log('err', err)
      res.status(500)
    }
  }

  res.json(response)
}
