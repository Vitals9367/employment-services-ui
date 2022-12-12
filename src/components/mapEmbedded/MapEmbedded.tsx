import { IconLocation, IconLinkExternal } from "hds-react"
import { useTranslation } from "next-i18next"
import styles from "./MapEmbedded.module.scss"

interface mapProps {
  mapId: number | null
}

export default function MapEmbedded({ mapId }: mapProps): JSX.Element {
  const { t } = useTranslation('common')
  const mapLink = `https://palvelukartta.hel.fi/fi/embed/unit/${mapId}`

  return (
    <div className={styles.mapEmbedded}>
      <div className={styles.mapTitle}>
        <IconLocation aria-hidden="true" /> {t('map.location')}
      </div>
      <iframe src={mapLink} width="100%" height="400px" />
      <div className={styles.mapFooter}>
          <a href={mapLink} target="_blank" rel="noreferrer">{t('map.new_window')}</a> <IconLinkExternal aria-hidden="true" />
      </div>
    </div>
  )
}