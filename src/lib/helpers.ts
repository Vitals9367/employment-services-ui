import { DrupalJsonApiParams } from "drupal-jsonapi-params"
import { DrupalMenuLinkContent, DrupalNode, getResource } from "next-drupal"
import { Node } from '@/lib/types'
import getConfig from 'next/config'

import { i18n } from "next-i18next.config"

import { BreadcrumbContent } from "./types"


export const eventTags = ['maahanmuuttajat', 'nuoret', 'info', 'koulutus', 'messut', 'neuvonta', 'rekrytointi', 'työpajat', 'digitaidot', 'etätapahtuma', 'palkkatuki', 'työnhaku']

export const isExternalLink = (href: string): boolean|undefined => {
  const isExternalLink = href && (href.startsWith('https://') || href.startsWith('https://'))

  return isExternalLink || false
}

export const getImageUrl = (url: string): string => {
  const host = getConfig().publicRuntimeConfig.NEXT_IMAGE_DOMAIN
  url = url.substring(url.indexOf('/sites'))

  return url ? `https://${host}${url}` : ''
}

export const getPath = (url: string) => {
  const urlParts =  url.split('/')
  const newsPath = urlParts.pop()

  return (`/${newsPath}`)
}

export async function getLanguageLinks(node: DrupalNode): Promise<Object> {
  let params = new DrupalJsonApiParams().addFields(node.type, ['path']).getQueryObject()
  const uuid = node.id

  let langLinks = {}
  for (let locale of i18n.locales) {
    let prefix = locale !== i18n.defaultLocale ? `/${locale}` : ''
    let link = ''
    if (locale === node.langcode) {
      link = `${prefix}${node?.path.alias}` // current page link
    } else {
      // this has the original alias if not translated
      const response = await getResource(node.type, uuid, {params, locale, defaultLocale: i18n.defaultLocale})
      link = `${prefix}${response?.path.alias}`
    }
    Object.assign(langLinks, {[locale]: link})
  }

  return langLinks
}

export const getBreadCrumb = (menuItems: DrupalMenuLinkContent[], path: string, title: string): BreadcrumbContent[] => {
  const page = menuItems.find(({ url }) => url === path)
  // Pages that are not in menus always get a breadcrumb.
  if (!page) {
    return [{
      id: 'current_page_crumb',
      title: title,
      url: path
    }]
  }
  // Landing pages don't need breadcrumb.
  if (page?.parent === '') {
    return []
  }
  const breadcrumbs: BreadcrumbContent[] = [page]
  let parentItem = menuItems.find(({ id }) => id === page?.parent)
  if (parentItem) {
    breadcrumbs.push(parentItem)
    // This should always exit early and never infloop.
    for (let i=0; i < menuItems.length; i++) {
      parentItem = menuItems.find(({ id }) => id === parentItem?.parent)
      if (parentItem) {
        breadcrumbs.push(parentItem)
      }
      if (!parentItem?.parent) break
    }
  }
  return breadcrumbs.reverse()
}

export const deleteCookie = (event: any, name: string, history: any) => {
  event.preventDefault()
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  history.go(0)
}

export const getTitle = (node: Node, suffix: String) => {
  let title = node.field_metatags?.title ? node.field_metatags.title : node.title
  return suffix ? title + " | " + suffix : title
}

export const getDescription = (node: Node) => {
  if (node.field_metatags?.description) {
    return node.field_metatags.description
  }

  switch (node.type) {
    case 'node--page':
      return node.field_lead_in

    case 'node--landing_page':
      if (!node.field_hero?.field_hero_desc) {
        break
      }
      return node.field_hero.field_hero_desc.processed.replace(/(<([^>]+)>)/gi, "")

    case 'node--event':
      if (!node?.field_short_description) {
        break
      }
      return node.field_short_description.processed.replace(/(<([^>]+)>)/gi, "")

    case 'node--article':
      if (!node?.field_lead) {
        break
      }
      return node.field_lead

    default:
      break
  }

  return ''
}

export const getDefaultImage = (node: Node) => {
  switch (node.type) {
    case 'node--event':
      if (!node?.field_image_url) {
        break
      }
      return node.field_image_url

    case 'node--landing_page':
      if (!node?.field_hero) {
        break
      }
      return node.field_hero.field_custom_hero_image?.field_media_image?.image_style_uri?.['hero']

    default:
      break
  }

  return process.env.NEXT_PUBLIC_SITE_URL + "/tyollisyyspalvelut.png"
}