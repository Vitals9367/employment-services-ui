import { Key } from 'react';
import { useTranslation } from 'next-i18next';
import { Container, IconPersonWheelchair } from 'hds-react';

import { NavProps, TprUnitData } from '@/lib/types';
import { groupData } from '@/lib/helpers';
import ContentMapper from '@/components/ContentMapper';
import { Sidebar } from '@/components/navigation/Sidebar';
import HtmlBlock from '@/components/HtmlBlock';
import MediaImage from '@/components/mediaImage/MediaImage';
import styles from './tprUnitPage.module.scss';
import AccordionWithIcon from '../accordion/AccordionWithIcon';
import ContactInfo from '../contactInfo/ContactInfo';

interface NodeTprUnitProps {
  node: TprUnitData;
  sidebar: NavProps;
  preview: boolean | undefined;
}

function NodeTprUnitPage({
  node,
  sidebar,
  preview,
  ...props
}: NodeTprUnitProps): JSX.Element {
  const {
    name,
    name_override,
    description,
    field_content,
    field_lower_content,
    phone,
    email,
    address,
    address_postal,
    opening_hours,
    call_charge_info,
    service_map_embed,
    picture_url,
    picture_url_override,
    drupal_internal__id,
  } = node;

  const { t } = useTranslation('common');
  const pageTitle = name_override ?? name;
  const picture = picture_url_override ?? picture_url;
  const arrivalContent: string[] = [];
  const otherContent: any = [];

  field_content?.map((content: any) =>
    content.type === 'paragraph--text' && field_content[0].id == content.id
      ? arrivalContent.push(content)
      : otherContent.push(content)
  );

  return (
    <article>
      <Container className="container">
        <div className="columns">
          <div className="sidebar col col-4 flex-order-first">
            <Sidebar {...sidebar} />
            <ContactInfo
              aside={true}
              phone={phone}
              email={email}
              address={address}
              address_postal={address_postal}
              opening_hours={opening_hours}
              call_charge_info={call_charge_info}
              service_map_embed={service_map_embed}
            />
          </div>
          <div className="content-region col col-8 flex-grow">
            <h1>{pageTitle}</h1>
            {description && (
              <div className="lead-in">
                <HtmlBlock field_text={description} />
              </div>
            )}
            {picture && (
              <div className={styles.unitImage}>
                <MediaImage media={picture} />
              </div>
            )}
            <ContactInfo
              phone={phone}
              email={email}
              address={address}
              address_postal={address_postal}
              opening_hours={opening_hours}
              call_charge_info={call_charge_info}
              service_map_embed={service_map_embed}
            />
            {field_content?.length > 0 && (
              <ContentMapper
                content={arrivalContent}
                pageType="tpr_unit"
                locationId={drupal_internal__id}
                mapId={service_map_embed}
              />
            )}
            {node.accessibility_sentences.length !== 0 && (
              <AccordionWithIcon
                ariaLabel={t('unit.accessibility_information')}
                accordionTitle={t('unit.accessibility_information')}
                backgroundColor={{
                  background: 'var(--color-silver-medium-light)',
                }}
                leftIcon={
                  <IconPersonWheelchair
                    size="xl"
                    color="var(--color-black)"
                    aria-hidden="true"
                  />
                }
              >
                {groupData(node.accessibility_sentences).map(
                  (groupName: string, i: Key) => (
                    <div key={i}>
                      <h3>{groupName}</h3>
                      <ul>
                        {node.accessibility_sentences
                          ?.filter(
                            (group: { group: {} }) => groupName === group.group
                          )
                          .map(
                            (
                              value: { group: string; value: string },
                              i: number
                            ) => (
                              <li key={`${value.group}-${i}`}>{value.value}</li>
                            )
                          )}
                      </ul>
                    </div>
                  )
                )}
              </AccordionWithIcon>
            )}
            {field_content?.length > 0 && (
              <ContentMapper
                content={otherContent}
                pageType="tpr_unit"
                locationId={drupal_internal__id}
                mapId={service_map_embed}
              />
            )}
          </div>
        </div>
        <div className="columns">
          <div className="lower-content-region col col-12">
            {field_lower_content?.length > 0 && (
              <ContentMapper
                content={field_lower_content}
                pageType="tpr_unit"
              />
            )}
          </div>
        </div>
      </Container>
    </article>
  );
}

export default NodeTprUnitPage;
