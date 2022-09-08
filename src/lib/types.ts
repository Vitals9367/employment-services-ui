import {
  DrupalNode,
  Locale,
  DrupalMenuLinkContent,
} from 'next-drupal'

export interface Node extends DrupalNode {
  title: string
  field_hero?: {
    field_hero_desc: DrupalFormattedText
    field_custom_hero_image: any
  }
  field_lead_in?: string
  field_content: any
  field_notification: any
  field_lower_content: any
  field_hide_sidebar: boolean
  name: string
  description: DrupalFormattedText
  phone: any
  address: any
  address_postal: string
  opening_hours: any
}

type TextFormats = 'basic_html' | 'restricted_html' | 'plain_text'
export interface DrupalFormattedText {
  format: TextFormats
  processed: string
  value: string
}

export interface NavProps {
  locale: Locale
  menu?: DrupalMenuLinkContent[]
  themes?: DrupalMenuLinkContent[]
  langLinks?: any
  breadcrumb?: any
}

export interface FooterProps {
  locale: Locale
  footerNav?: DrupalMenuLinkContent[]
}

export interface BreadcrumbContent {
  id: string
  title: string
  url: string
}

export interface Tags {
  [key: string]: string | string[]
}

export interface EventData {
  title: string
  url: string
  field_image_url: string
  field_image_alt: string
  field_start_time: number
  field_end_time: number
  field_location: string
  field_tags: string[]
}

export interface TprUnitData extends DrupalNode {
  name: string
  description: DrupalFormattedText
  field_content: any
  field_lower_content: any
  phone: any
  address: any
  address_postal: string
  opening_hours: any
}

export interface EventState {
  total: number
  events: EventData[]
}
declare global {
  interface Window {
    _paq: any
    rnsData: any
  }
}
