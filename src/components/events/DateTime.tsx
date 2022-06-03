import dateformat from 'dateformat'
import { IconCalendar, IconClock } from 'hds-react'

import styles from './events.module.scss'

export interface DateTimeProps {
  startTime: string
  endTime: string
}

function DateTime(props: DateTimeProps): JSX.Element {
  const { startTime, endTime } = props

  const startDate = new Date(startTime)
  const endDate = new Date(endTime)

  const isSameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()

  return (
    <div className={styles.dateTime}>
      <div>
        <IconCalendar />
        <div>
          {`${dateformat(startTime, 'dd.mm.yyyy')}`}

          {!isSameDay && (
            ` - ${dateformat(endTime, 'dd.mm.yyyy')}`
          )}
        
        </div>
      </div>
      <div>
        <IconClock />
        {`${dateformat(startTime,'HH:MM')} - ${dateformat(endTime, 'HH:MM')}`}
      </div>
    </div>
  )
}

export default DateTime;
