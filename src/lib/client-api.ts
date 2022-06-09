import axios from 'axios'
import qs from 'qs'
import { Tags } from 'src/lib/types'


/** The Client API urls  */
const EVENTS_URL = '/api/events'

export const getEvents = async (tags: Tags) => {
  const { data } = await axios(`${EVENTS_URL}`, {
    params:
      tags,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
  })

  return data
}
