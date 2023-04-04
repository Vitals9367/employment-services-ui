import { NextApiResponse } from "next"
import { DrupalMenuLinkContent, DrupalNode, getResource } from "next-drupal"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"
import { Node } from '@/lib/types'
import getConfig from 'next/config'

import { i18n } from "next-i18next.config"

import { BreadcrumbContent } from "./types"
import { NODE_TYPES } from '@/lib/drupalApiTypes'

export const eventTags = ['maahanmuuttajat', 'nuoret', 'info', 'koulutus', 'messut', 'neuvonta', 'rekrytointi', 'työpajat', 'digitaidot', 'etätapahtuma', 'palkkatuki', 'työnhaku']
export const printablePages = [NODE_TYPES.ARTICLE, NODE_TYPES.EVENT, NODE_TYPES.PAGE, NODE_TYPES.TPR_UNIT]

export const isExternalLink = (href: string): boolean|undefined => {
  const isExternalLink = href && (href.startsWith('https://') || href.startsWith('https://'))

  return isExternalLink || false
}

export const getImageUrl = (url: string): string => {
  if (!url) {
    return ''
  }

  const host = getConfig().publicRuntimeConfig.NEXT_IMAGE_DOMAIN
  url = url.substring(url.indexOf('/sites'))

  return url ? `https://${host}${url}` : ''
}

export const getPath = (url: string): string => {
  const newUrl = new URL(url)

  return (newUrl.pathname)
}

export const getPathAlias = (path: any): string => {
  if (!path) {
    return ''
  }

  return path.langcode === 'fi' ? path.alias : `/${path.langcode}${path.alias}`
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

export const getBreadCrumb = (menuItems: DrupalMenuLinkContent[], path: string, title: string, type: string): BreadcrumbContent[] => {
  const page = menuItems.find(({ url }) => url === path)

  // TPR Unit may not have menu attachment
  if (!page && (type === 'tpr_unit--tpr_unit')) {
    return []
  }

  // Breadcrumb object for pages without menu attachment
  let newPage: any = {
    id: 'current_page_crumb',
    title: title,
    url: path,
    parent: ''
  }

  // Pages that are not in menus always get a breadcrumb.
  if (!page) {
    // Custom breadcrumb for Event pages
    if (type !== 'node--event') {
      return [newPage]
    }

    // Read parent from the page path
    const parentPath = path.substring(0, path.lastIndexOf('/'))
    // Load parent menu object
    const parentPage = menuItems.find(({ url }) => url.includes(parentPath))

    // Event page doesn't have parent
    if (!parentPage?.id) {
      return [newPage]
    }

    // Create parent id for the page
    newPage.parent = parentPage.id
  }

  // Landing pages don't need breadcrumb.
  if (page?.parent === '') {
    return []
  }

  // Create handle for the page object based on above
  const pageHandle: any = newPage.parent !== '' ? newPage : page

  const breadcrumbs: BreadcrumbContent[] = [pageHandle]
  let parentItem = menuItems.find(({ id }) => id === pageHandle.parent)

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

export const getTitle = (node: Node, suffix: String): string => {
  let pageTitle = node.title

  if (node.type === 'tpr_unit--tpr_unit') {
    pageTitle = node.name_override ? node.name_override : node.name
  }

  const title = node.field_metatags?.title ? node.field_metatags.title : pageTitle
  return suffix ? `${title} | ${suffix}` : title
}

export const getDescription = (node: Node): any => {
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

    case 'tpr_unit--tpr_unit':
      if (!node?.description) {
        break
      }
      return node.description.value

    default:
      break
  }

  return ''
}

export const getDefaultImage = (node: Node): string => {
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

export const sortArrayByOtherArray = (array: any[], sortArray: string[]) => {
  return [...array].sort(
    (a , b) => sortArray.indexOf(a.name_override) - sortArray.indexOf(b.name_override)
  )
}

export const getLocale = (res: NextApiResponse<any>) => {
  const host = res.req.headers.host
  const url = res.req.headers.referer
    ?.replace(`http://${host}/`, '')
    .slice(0, 2)
  const locale = url === 'en' || url === 'sv' ? url : 'fi'
  return locale
}
