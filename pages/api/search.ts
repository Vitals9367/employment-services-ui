import type { NextApiRequest, NextApiResponse } from 'next'
import * as Elastic from '@/lib/elasticsearch'
import { SearchState, SearchData } from '@/lib/types'
import { SearchHit, SearchTotalHits, MsearchMultisearchBody, SearchRequest } from '@elastic/elasticsearch/lib/api/types'
import { Locale } from 'next-drupal'

type Data = SearchState

interface QueryParams {
  q: string
  index: number
  locale: Locale
}

function pick_highlight(highlight: any) {
  const highlight_priority = ['title', 'field_lead_in', 'field_description'];
  for (const field of highlight_priority) {
    if (highlight.hasOwnProperty(field)) {
      return highlight[field];
    }
  }

  return Object.values(highlight)[0] // Return *_text
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
    },
    highlight: {
      pre_tags: [""],
      post_tags: [""],
      number_of_fragments: 1,
      fragment_size: 10,
      fields : {
        "title": { },
        "field_lead_in": { },
        "field_description": { },
        "*_text": { }
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
        const { entity_type, type, title, field_lead_in, field_description, url } = hit._source as SearchData
        const highlight = hit.highlight && pick_highlight(hit.highlight)

        return { entity_type, type, title, field_lead_in, field_description, url, highlight }
      }),
    })

  } catch (err) {
    console.log('err', err)
    res.status(500)
  }

}