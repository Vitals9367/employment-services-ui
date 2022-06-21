import dateformat from 'dateformat'
import { IconCalendar, IconClock } from 'hds-react'

import styles from './events.module.scss'

export interface DateTimeProps {
  startTime: number
  endTime: number
}

function DateTime(props: DateTimeProps): JSX.Element {
  const { startTime, endTime } = props

  // new Date() function needs to be supplied with a milliseconds value.
  const startDate = new Date(startTime * 1000)
  const endDate = new Date(endTime * 1000)

  const isSameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()

  return (
    <div className={styles.dateTime}>
      <div>
        <IconCalendar />
        <div>
          {`${dateformat(startDate, 'dd.mm.yyyy')}`}
          
          {!isSameDay && (
            ` - ${dateformat(endDate, 'dd.mm.yyyy')}`
          )}
        </div>
      </div>
      <div>
        <IconClock />
        {`${dateformat(startDate,'HH:MM')} - ${dateformat(endDate, 'HH:MM')}`}
      </div>
    </div>
  )
}

export default DateTime
