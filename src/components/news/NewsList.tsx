import useSWR from 'swr'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Linkbox, Button as HDSButton, IconPlus, IconCrossCircle, IconArrowRight } from 'hds-react'
import { DrupalFormattedText } from '@/lib/types'
import {getNewsPath} from '@/lib/helpers'
import {getNews} from '@/lib/client-api'
import dateformat from 'dateformat'
import HtmlBlock from '@/components/HtmlBlock'
import styles from './news.module.scss'

interface NewsListProps {
  field_title: string
  field_short_list: boolean
  field_news_list_desc: DrupalFormattedText
}

function NewstList(props: NewsListProps): JSX.Element {
  const { field_title, field_short_list, field_news_list_desc } = props
  const { t } = useTranslation()
  const fetcher = () => getNews()
  const { locale, asPath } = useRouter()
  const { data: news, error } = useSWR(
    `/${locale}/${asPath}`,
    fetcher
  )
console.log(news)
  return (
    <div className='component'>
      <div className={styles.newsListTitleArea}>
        {field_title &&
          <h2>{field_title}</h2>
        }
        {field_short_list &&
          <a href={t('list.news_url')}>{t('list.show_all_news')} <IconArrowRight size="l" /></a>
        }
      </div>
      {field_news_list_desc?.processed &&
        <div className={styles.eventListDescription}>
          <HtmlBlock field_text={field_news_list_desc} />
        </div>
      }
      <div className={`${styles.eventList} ${field_short_list && styles.short}`}>
        { news && news.map((news: any, key: any) => (
          <div className={styles.eventCard} key={key}>
            <Linkbox
              className={styles.linkBox}
              linkboxAriaLabel="List of links Linkbox"
              linkAriaLabel="Linkbox link"
              key={key}
              href={`${t('list.news_url')}${getNewsPath(news.path.alias)}`}
              withBorder
            >
              <div className={styles.eventCardContent}>
              <p className={styles.articleDate}><time dateTime={news.created}>{`${dateformat(news.created, 'dd.mm.yyyy')}`}</time></p>
              </div>
            </Linkbox>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewstList