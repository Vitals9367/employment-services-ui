import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import { Button, Container, IconAngleDown, IconAngleUp, IconArrowRight } from 'hds-react';

import { EventData, EventsRelatedQueryParams } from '@/lib/types';
import { getRelatedEvents } from '@/lib/client-api';
import DateTimeSimple from '../dateTime/DateTimeSimple';
import styles from './events.module.scss';

interface DateTimeProps {
  superEvent: string;
}

export function RelatedEvents(props: DateTimeProps): JSX.Element {
  const fetcher = () => getRelatedEvents(queryParams);
  const { data: events } = useSWR(`api/related-events`, fetcher);
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [showAll, setShowAll] = useState<boolean>(false);
  const [eventData, setEventData] = useState<EventData[]>(events);
  const queryParams: EventsRelatedQueryParams = {
    superEvent: props.superEvent,
    locale: locale,
  };

  useEffect(() => {
    showAll ? setEventData(events) : setEventData(events?.slice(0, 3));
  }, [events, showAll]);

  return (
    <div className="component hide-print">
      <Container className="container">
        {eventData?.map((event: EventData, i: number) => (
          <div key={i} className={styles.relatedEvent}>
            <Link href={event.path.alias} style={{ width: 'fit-content' }}>
              <DateTimeSimple
                startTime={event.field_start_time}
                endTime={event.field_end_time}
              />
              <IconArrowRight size="s" aria-hidden />
            </Link>
          </div>
        ))}
        <Button
          variant="supplementary"
          iconRight={showAll ? <IconAngleUp /> : <IconAngleDown />}
          style={{ background: 'none', color: 'black', margin: 0, padding: 0 }}
          onClick={() => {
            setShowAll(!showAll);
          }}
        >
         {showAll ? t('event.showLess') : t('event.showAll')} 
        </Button>
      </Container>
    </div>
  );
}
