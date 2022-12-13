import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch'
import { SearchState, SearchData } from '@/lib/types'
import { SearchHit, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
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
  const body: any = {
    size: size,
    from: from,
    query: {
      multi_match: {
        query: q,
        type: "best_fields",
        fields: [
          "title^3",
          "*_text",
          "field_lead_in^2",
          "field_description^2"
        ],
        operator: "and",
        fuzziness: "AUTO"
      }
    }
  }

  try {
    const searchRes = await elastic.search({
      index: `*_${locale}`,
      body: body
    })

    const {
      hits: { total, hits }
    } = searchRes as { hits: { total: SearchTotalHits, hits: SearchHit<unknown>[] }}

    // res.json(hits)
    res.json({
      total: total?.value,
      results: hits.map((hit: any) => {
        const { entity_type, type, title, field_lead_in, field_description, url } = hit._source as SearchData
        return { entity_type, type, title, field_lead_in, field_description, url }
      }),
    })

  } catch (err) {
    console.log('err', err)
    res.status(500)
  }

}