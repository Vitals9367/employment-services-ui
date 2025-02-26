import { Button } from 'hds-react';
import { useTranslation } from 'next-i18next';

import { getAvailableTags } from '@/lib/helpers';
import { EventData } from '@/lib/types';
import styles from '../events/events.module.scss';

interface ButtonFilterProps {
  tags: string[];
  events: EventData[];
  setFilter: (newFilter: any) => void; 
  filter: string[];
  filterField: string;
  filterLabel: string;
  setAvailableTags?: boolean;
}

function ButtonFilter({
    tags,
  events,
  setFilter,
  filter,
  filterField,
  filterLabel,
  setAvailableTags = true,
}: ButtonFilterProps) {
  const { t } = useTranslation();
  return (
    <div>
      <div className={styles.filter}>{t(filterLabel)}</div>
      <div
        role="group"
        aria-label={t('search.group_description')}
        className={styles.filterTags}
      >
        {tags?.map((tag: string, i: number) => (
          <Button
            disabled={
              setAvailableTags
                ? !getAvailableTags(events, filterField).includes(tag)
                : false
            }
            role="checkbox"
            aria-checked={filter.includes(tag)}
            aria-label={`${t(filterLabel)} ${tag.replace('_', ' ')}`}
            key={`tagFilter-${i}`}
            className={
              filter.includes(tag) &&
              getAvailableTags(events, filterField).includes(tag)
                ? styles.selected
                : styles.filterTag
            }
            onClick={() =>
              setFilter((current: string[]) =>
                current?.includes(tag)
                  ? [...current].filter(function (item) {
                      return item !== tag;
                    })
                  : [...current, tag]
              )
            }
          >
            {tag.replace('_', ' ')}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default ButtonFilter;
