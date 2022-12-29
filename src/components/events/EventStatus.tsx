import { useTranslation } from "next-i18next"

interface StatusProps {
  field_event_status: string | string[] | null | undefined
}

export default function EventStatus(event: StatusProps): JSX.Element {
  const { t } = useTranslation()

  if (event.field_event_status === undefined || event.field_event_status === null) {
    return (<></>)
  }

  const status = typeof event.field_event_status === 'object' ? event.field_event_status[0] : event.field_event_status

  if (status !== 'EventCancelled') {
    return (<></>)
  }

  return (<strong style={{'color': 'var(--color-brick)'}}>{t('event.cancelled_text')}: </strong>)
}
