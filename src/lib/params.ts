import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import { NODE_TYPES, CONTENT_TYPES } from './drupalApiTypes'

// Common includes and fields for all page level NODE types.
const baseQueryParams = () =>
  new DrupalJsonApiParams()
    .addInclude([
      'field_content.field_list_of_links_links.field_list_of_links_image.field_media_image',
      'field_content.field_background_color',
    ])
    .addFields(CONTENT_TYPES.MEDIA_IMAGE, [
      'field_media_image',
      'field_photographer',
    ])
    .addFields(CONTENT_TYPES.ACCORDION, [
      'field_accordion_title_level',
      'field_accordion_text',
      'field_accordion_title',
      'field_accordion_heading_level',
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

const getPageQueryParams = () =>
  baseQueryParams()
    .addFields(NODE_TYPES.PAGE, [
      'id',
      'title',
      'path',
      'revision_timestamp',
      'langcode',
      'field_content',
      'field_lead_in',
      'field_metatags',
    ])
    .addInclude([
      'field_content.field_accordion_items.field_accordion_item_content',
    ])
    .getQueryObject()

const getLandingPageQueryParams = () =>
  baseQueryParams()
    .addFields(NODE_TYPES.LANDING_PAGE, [
      'id',
      'title',
      'path',
      'revision_timestamp',
      'langcode',
      'field_content',
      'field_hero',
      'field_metatags',
    ])
    .getQueryObject()

export const getQueryParamsFor = (type: string) => {
  switch (type) {
    case NODE_TYPES.PAGE:
      return getPageQueryParams()
  }
  switch (type) {
    case NODE_TYPES.LANDING_PAGE:
      return getLandingPageQueryParams()
  }
}
