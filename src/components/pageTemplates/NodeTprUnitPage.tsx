import {useTranslation} from 'next-i18next'
import parse from 'html-react-parser'
import {
  Container,
  IconClock,
  IconLocation,
  IconPhone,
  IconEnvelope,
  IconPersonWheelchair
} from 'hds-react'

import {NavProps, TprUnitData} from '@/lib/types'
import { groupData } from '@/lib/helpers'
import ContentMapper from '@/components/ContentMapper'
import {Sidebar} from '@/components/navigation/Sidebar'
import HtmlBlock from '@/components/HtmlBlock'
import MediaImage from '@/components/mediaImage/MediaImage'
import styles from './tprUnitPage.module.scss'
import AccordionWithIcon from '../accordion/AccordionWithIcon'

interface NodeTprUnitProps {
  node: TprUnitData
  sidebar: NavProps
}

interface BlockProps {
  title: string
  icon: string
  content: any
}

interface ContactInfoProps {
  aside?: boolean
}

function NodeTprUnitPage({
  node,
  sidebar,
  ...props
}: NodeTprUnitProps): JSX.Element {
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
    picture_url_override,
    drupal_internal__id,
  } = node

  const {t} = useTranslation('common')
  const pageTitle = name_override ? name_override : name
  const picture = picture_url_override ? picture_url_override : picture_url

  const Block = (block: BlockProps): JSX.Element => {
    const {title, icon, content} = block
    const iconsMap: any = {
      location: IconLocation,
      clock: IconClock,
      phone: IconPhone,
      envelope: IconEnvelope,
    }
    const IconTag = iconsMap[icon]

    return (
      <div className={`${styles.infoBlock} onSidebar`}>
        <div className={styles.icon}>
          <IconTag aria-hidden='true' />
        </div>
        <div className={styles.blockContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.content}>
            <p>
              {parse(content.join('<br/>').replace(/(?:\r\n|\r|\n)/g, '<br/>'))}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const ContactInfo = ({aside}: ContactInfoProps): JSX.Element => {
    return (
      <div className={`${styles.contactInfo} ${aside ? styles.aside : ''}`}>
        <div className={styles.contentTitle}>
          <span>{t('unit.contact_information')}</span>
        </div>
        {address.address_line1 && (
          <Block
            title={t('unit.visit_address')}
            icon='location'
            content={[
              address.address_line1,
              address.postal_code,
              address.locality,
            ]}
          />
        )}

        {opening_hours && (
          <Block
            title={t('unit.open_hours')}
            icon='clock'
            content={[opening_hours[0].value]}
          />
        )}

        {phone && (
          <Block
            title={t('unit.phone_service')}
            icon='phone'
            content={[`${phone} (${call_charge_info.value})`]}
          />
        )}

        {address_postal && (
          <Block
            title={t('unit.postal_address')}
            icon='envelope'
            content={[address_postal]}
          />
        )}
      </div>
    )
  }

  return (
    <article>
      <Container className='container'>
        <div className='columns'>
          <div className='content-region col col-8 flex-grow'>
            <h1>{pageTitle}</h1>
            {description && (
              <div className='lead-in'>
                <HtmlBlock field_text={description} />
              </div>
            )}

            {picture && (
              <div className={styles.unitImage}>
                <MediaImage media={picture} />
              </div>
            )}

            <ContactInfo />

            {field_content?.length > 0 && (
              <ContentMapper
                content={field_content}
                pageType='tpr_unit'
                locationId={drupal_internal__id}
                mapId={service_map_embed}
              />
            )}
          </div>
          <div className='sidebar col col-4 flex-order-first'>
            <Sidebar {...sidebar} />
            <ContactInfo aside={true} />
          </div>
        </div>
        <div className='columns'>
          <div className='lower-content-region col col-12'>
            {field_lower_content?.length > 0 && (
              <ContentMapper
                content={field_lower_content}
                pageType='tpr_unit'
              />
            )}
          </div>
        </div>
        {node.accessibility_sentences.length !== 0 && (
          <AccordionWithIcon
            ariaLabel={t('unit.accessibility_information')}
            accordionTitle={t('unit.accessibility_information')}
            data={node.accessibility_sentences}
            group={groupData(node.accessibility_sentences)}
            backgroundColor={{ background: 'var(--color-silver-medium-light)' }}
            leftIcon={
              <IconPersonWheelchair
                size='xl'
                color='var(--color-black)'
                aria-hidden='true'
              />
            }
          />
        )}
      </Container>
    </article>
  )
}

export default NodeTprUnitPage
