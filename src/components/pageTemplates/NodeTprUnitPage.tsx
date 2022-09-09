import { Container, IconClock, IconLocation, IconPhone, IconEnvelope } from 'hds-react'
import { useTranslation } from 'next-i18next'
import { NavProps, TprUnitData } from '@/lib/types'
import ContentMapper from '@/components/ContentMapper'
import { Sidebar } from '@/components/navigation/Sidebar'
import HtmlBlock from "@/components/HtmlBlock"
import MapEmbedded from "@/components/mapEmbedded/MapEmbedded"
import parse from "html-react-parser"
import styles from './tprUnitPage.module.scss'
import MediaImage from "@/components/mediaImage/MediaImage";

interface NodeTprUnitProps {
  node: TprUnitData
  sidebar: NavProps
}

interface BlockProps {
  title: string
  icon: string
  content: any
}

function NodeTprUnitPage({ node, sidebar, ...props }: NodeTprUnitProps): JSX.Element {
  const {
    name,
    name_override,
    description,
    field_content,
    field_lower_content,
    phone,
    address,
    address_postal,
    opening_hours,
    call_charge_info,
    service_map_embed,
    picture_url,
    picture_url_override
  } = node

  const { t } = useTranslation('common')
  const pageTitle = name_override ? name_override : name
  const picture = picture_url_override ? picture_url_override : picture_url

  const Block = (block: BlockProps): JSX.Element => {
    const { title, icon, content } = block
    const iconsMap :any = {
      'location': IconLocation,
      'clock': IconClock,
      'phone': IconPhone,
      'envelope': IconEnvelope
    }
    const IconTag = iconsMap[icon]

    return (
      <div className={styles.sidebarBlock}>
        <div className={styles.icon}><IconTag aria-hidden="true" /></div>
        <div className={styles.blockContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.content}>
            <p>
              {parse(content.join("<br/>").replace(/(?:\r\n|\r|\n)/g, '<br/>'))}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article>
      <Container className="container">
        <div className="columns">
          <div className="content-region col col-8 flex-grow">
            <h1>{pageTitle}</h1>
            {description && (
              <div className='lead-in'><HtmlBlock field_text={description} /></div>
            )}

            {picture && (
              <div className={styles.unitImage}>
                <MediaImage media={picture} />
              </div>
            )}

            {field_content?.length > 0 && (
              <ContentMapper content={field_content} pageType='tpr_unit' />
            )}

            <MapEmbedded id={service_map_embed} />
          </div>
          <div className="sidebar col col-4 flex-order-first">
            <Sidebar {...sidebar}/>

            <div className={styles.sidebarContent}>
              <div className={styles.contentTitle}>
                <span>{t('unit.contact_information')}</span>
              </div>

              {address.address_line1 && (
                <Block title={t('unit.visit_address')} icon="location" content={[address.address_line1, address.postal_code, address.locality]} />
              )}

              {opening_hours && (
                <Block title={t('unit.open_hours')} icon="clock" content={[opening_hours[0].value]} />
              )}

              {phone && (
                <Block title={t('unit.phone_service')} icon="phone" content={[`${phone} (${call_charge_info.value})`]} />
              )}

              {address_postal && (
                <Block title={t('unit.postal_address')} icon="envelope" content={[address_postal]} />
              )}
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="lower-content-region col col-12">
            {field_lower_content?.length > 0 && (
              <ContentMapper content={field_lower_content} pageType='tpr_unit' />
            )}
          </div>
        </div>
      </Container>
    </article>
  )
}

export default NodeTprUnitPage
