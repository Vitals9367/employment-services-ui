import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch'
import { SearchState, SearchData } from '@/lib/types'
import { SearchHit, SearchTotalHits, SearchRequest } from '@elastic/elasticsearch/lib/api/types'
import { Locale } from 'next-drupal'

type Data = SearchState

interface QueryParams {
  q: string
  index: number
  locale: Locale
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400)
    return  
  }

  const { q, index, locale }:QueryParams = req?.query as any
  const elastic = Elastic.getElasticClient()
  const size = 20
  const from: number = index > 0 ? size * index : 0
  const body: SearchRequest = {
    index: `*_${locale}`,
    size: size,
    from: from,
    query: {
      boosting: {
        positive: {
          bool: {
            must: {
              multi_match: {
                query: q,
                type: "best_fields",
                fields: [
                  "field_search_keywords^8",
                  "title^5",
                  "*_title^3",
                  "*_text",
                  "field_lead_in^2",
                  "field_description^2"
                ],
                operator: "and",
                fuzziness: 1
              }
            },
            must_not: {
              term: {
                field_hide_search: "true"
              }
            }
          }
        },
        negative: {
          term: {
            type: 'event'
          }
        },
        negative_boost: 0.2
      }
    }
  }

  try {
    const searchRes = await elastic.search({
      ...body
    })

    const {
      hits: { total, hits }
    } = searchRes as { hits: { total: SearchTotalHits, hits: SearchHit<unknown>[] }}

    // res.json(hits)
    res.json({
      total: total?.value,
      results: hits.map((hit: any) => {
        const { entity_type, type, title, field_lead_in, field_description, url, field_start_time, field_end_time, changed } = hit._source as SearchData

        return { entity_type, type, title, field_lead_in, field_description, url, field_start_time, field_end_time, changed }
      }),
    })

  } catch (err) {
    console.log('err', err)
    res.status(500)
  }

}