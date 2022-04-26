import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import { NODE_TYPES, CONTENT_TYPES } from './drupalApiTypes'

export function getParams(type: string) {

  let params = new DrupalJsonApiParams()

  if (type === NODE_TYPES.PAGE) {
    params.addInclude([
      'field_content',
    ])
    .addInclude([
      'field_content.field_accordion_items.field_accordion_item_content',
      'field_content.field_list_of_links_links.field_list_of_links_image.field_media_image',
    ])
    .addFields(CONTENT_TYPES.MEDIA_IMAGE, [
      'field_media_image',
      'field_photographer',
    ])
    .addFields(CONTENT_TYPES.FILE, ['uri', 'url', 'image_style_uri'])
  }

  return params.getQueryObject()
}