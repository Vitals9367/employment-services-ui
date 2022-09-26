import type { NextApiRequest, NextApiResponse } from 'next'
import { getUnits } from '@/lib/ssr-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let units: any = []
  // No posts allowed, no missing params-errors revealed.
  if (req.method !== 'GET') {
    res.status(400).json(units)
    return
  }

  units = await getUnits().catch((e) => {
    console.log('Error fetching units from Drupal: ', e)
    throw e
  })

  res
    .status(200)
    .json(units)
}
