import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import { NODE_TYPES, CONTENT_TYPES } from './drupalApiTypes'

export function getParams(type: string) {

  let params = new DrupalJsonApiParams()

  if (type === NODE_TYPES.PAGE) {
    params.addFields(NODE_TYPES.PAGE, [
      'id',
      'title',
      'path',
      'revision_timestamp',
      'langcode',
      'field_content',
      'field_hero',
      'field_lead_in',
      'field_metatags',
    ])
    .addInclude([
      'field_content.field_accordion_items.field_accordion_item_content',
      'field_content.field_list_of_links_links.field_list_of_links_image.field_media_image',
      'field_content.field_background_color',
    ])
    .addFields(CONTENT_TYPES.MEDIA_IMAGE, [
      'field_media_image',
      'field_photographer',
    ])
    .addFields(CONTENT_TYPES.ACCORDION, [
      'field_accordion_type',
      'field_accordion_title_level',
      'field_accordion_text',
      'field_accordion_title',
      'field_accordion_items'
    ])
    .addFields(CONTENT_TYPES.ACCORDION_ITEM, [
      'field_accordion_item_content',
      'field_accordion_item_heading'
    ])
    .addFields(CONTENT_TYPES.BANNER, [
      'field_background_color',
      'field_banner_desc',
      'field_banner_title',
      'field_icon'
    ])
    .addFields(CONTENT_TYPES.COLOR, ['name', 'field_css_name'])
    .addFields(CONTENT_TYPES.FILE, [
      'uri',
      'url',
      'image_style_uri'
    ])
  }

  return params.getQueryObject()
}