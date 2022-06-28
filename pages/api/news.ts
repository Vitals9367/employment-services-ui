import type { NextApiRequest, NextApiResponse } from 'next'
import { getNews } from '@/lib/ssr-api'

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  let news: any = []
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400).json(news)
    return
  }

  news = await getNews().catch((e) => {
    console.log('Error fetching news from Drupal: ', e)
    throw e
  })

  res
    .status(200)
    .json(news)
}
