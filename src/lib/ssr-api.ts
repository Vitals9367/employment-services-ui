import { getResourceCollection } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NODE_TYPES } from '@/lib/drupalApiTypes'
import { Tags } from 'src/lib/types'


export const getEvents = async ({ tags }: Tags) => {
  const eventParams = () =>
    new DrupalJsonApiParams()
      .addFields(NODE_TYPES.EVENT, [
        'id',
        'title',
        'path',
        'field_text',
        'field_image_url',
        'field_image_name',
        'field_image_alt',
        'field_location',
        'field_tags',
        'field_start_time',
        'field_end_time'
      ])
      .addSort('field_end_time', 'ASC')
      .addPageLimit(3)

    if (tags) {
      const filteredEventParams = () =>
        eventParams()
          .addFilter('field_tags', tags, 'IN')
          .getQueryObject()

      return await getResourceCollection(NODE_TYPES.EVENT, { params: filteredEventParams() })
    }

  return await getResourceCollection(NODE_TYPES.EVENT, { params: eventParams().getQueryObject() })
}
