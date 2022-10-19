import useSWR from 'swr'
import { useTranslation } from 'next-i18next'
import { IconArrowRight, Container } from 'hds-react'

import { getUnits } from '@/lib/client-api'

import MediaImage from '../mediaImage/MediaImage'
import styles from './units.module.scss'
import { getPathAlias } from '@/lib/helpers'
import { useRouter } from 'next/router'

function UnitsList(): JSX.Element {
  const { t } = useTranslation()
  const { locale } = useRouter()
  const fetcher = () => getUnits(locale != undefined ? locale : 'fi')
  const { data: units, error } = useSWR(
    `/units`,
    fetcher
  )

  return (
    <div className='component'>
      <Container className='container'>
        <div className={styles.unitsList}>
          { units && units.map((unit: any, key: any) => (
            <div key={key} className={styles.card}>
              <div className={styles.media}>
                <MediaImage media={unit.picture_url_override ? unit.picture_url_override : unit.picture_url} />
              </div>
              <div className={styles.description}>
                <h3>{unit.name_override ? unit.name_override : unit.name}</h3>
                <p>
                  {`${unit.address.address_line1 ? unit.address.address_line1 + ', ' : ''}`}
                  {`${unit.address.postal_code ? unit.address.postal_code + ', ' : ''}`}
                  {`${unit.address.locality ? unit.address.locality : ''}`}
                </p>
                <div className={styles.link}><a href={getPathAlias(unit.path)}></a><span>{t('unit.more_info')}</span><IconArrowRight /></div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

export default UnitsList
