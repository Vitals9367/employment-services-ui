import HtmlBlock from '@/components/HtmlBlock'
import { CONTENT_TYPES } from '@/lib/drupalApiTypes'
import ListOfLinks from '@/components/listOfLinks/ListOfLinks'
import Accordion from '@/components/accordion/Accordion'
import Banner from '@/components/banner/Banner'
import LiftupWithImage from '@/components/liftupWithImage/LiftupWithImage'
import Notification from '@/components/notification/Notification'
import { EventList, EventListWithFilters } from '@/components/events/EventList'
import NewsList from '@/components/news/NewsList'
import ParagraphImage from '@/components/paragraphImage/ParagraphImage'
import Quote from '@/components/quote/Quote'


interface ContentMapperProps {
  content: any,
  pageType?: string
}

export function ContentMapper({ content, pageType, ...props }: ContentMapperProps): JSX.Element {
 // console.log('content: ', content)

  return content.map((item: any) => {
    const { type, id } = item
    const key = `paragraph--${type}-${id}`

    switch(type) {
      case CONTENT_TYPES.TEXT:
        if (!item?.field_text?.processed) {
          return null
        }
        return <HtmlBlock {...item} key={key} />

      case CONTENT_TYPES.ACCORDION:
        if (!item?.field_accordion_items) {
          return null
        }
        return <Accordion {...item} key={key} />


      case CONTENT_TYPES.LIST_OF_LINKS:
        if (!item?.field_list_of_links_links) {
          return null
        }
        return <ListOfLinks {...item} key={key} />

      case CONTENT_TYPES.BANNER:
        if (!item?.id) {
          return null
        }
        return <Banner {...item} key={key} />

      case CONTENT_TYPES.NOTIFICATION:
        if (!item?.id) {
          return null
        }
        return <Notification {...item} key={key} />

      case CONTENT_TYPES.SUBHEADING:
        if (!item?.field_subheading_title) {
          return null
        }
        return (
          <div className='component' key={key}>
            <h2>{item.field_subheading_title}</h2>
          </div>
        )

      case CONTENT_TYPES.EVENTS_LIST:
        if (!item?.id) {
          return null
        }
        if (item.field_events_list_short) {
          return <EventList {...item} pageType={pageType} key={key} />
        }
        return <EventListWithFilters {...item} key={key} />

      case CONTENT_TYPES.NEWS_LIST:
        if (!item?.id) {
          return null
        }
        return <NewsList {...item} key={key} />


      case CONTENT_TYPES.LIFTUP_WITH_IMAGE:
        if (!item?.field_liftup_with_image_image) {
          return null
        }
        return <LiftupWithImage {...item} key={key} />

      case CONTENT_TYPES.PARAGRAPH_IMAGE:
        if (!item?.field_image) {
          return null
        }
        return <ParagraphImage {...item} key={key} />

      case CONTENT_TYPES.QUOTE:
        if (!item?.field_quote_content) {
          return null
        }
        return <Quote {...item} key={key} />

      default:
        console.log('unmapped type: ', type)
    }
  })
}

export default ContentMapper
