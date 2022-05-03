import { DrupalNode } from 'next-drupal'

export interface Node extends DrupalNode {
  title: string
  field_lead_in: string
  field_content: any
}
