import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'
import { Button as HDSButton, IconPlus, IconArrowRight, Container } from 'hds-react'

import dateformat from 'dateformat'

import { DrupalFormattedText, Node } from '@/lib/types'
import { getPathAlias } from '@/lib/helpers'
import { getNews } from '@/lib/client-api'

import HtmlBlock from '@/components/HtmlBlock'

import styles from './news.module.scss'

interface NewsListProps {
  field_title: string
  field_short_list: boolean
  field_news_list_desc: DrupalFormattedText
  langcode: string
}
interface News {
  published_at?: string,
  path: Path,
  title: string,
  status: boolean,
}

interface Path {
  alias: string,
  langcode: string,
  pid: number,
}

function NewsList(props: NewsListProps): JSX.Element {
  const { field_title, field_short_list, field_news_list_desc, langcode } = props
  const { t } = useTranslation()
  const [newsIndex, setNewsIndex] = useState<number>(1)
  const [paginatedNews, setPaginatedNews] = useState<Node[]>([])
  const fetcher = () => getNews(field_short_list, langcode)
  const { data: news, error } = useSWR(
    `/news`,
    fetcher
  )
  const total: number = news && news.length || 0

  useEffect(() => {
    const filterNews = () => {
      const pn = news && news.slice(0, 4*newsIndex)
      setPaginatedNews(pn)
    }
    filterNews()
  }, [news, newsIndex]) // eslint-disable-line

  const loadMoreText = t('list.load_more')

  return (
    <div className='component'>
      <Container className='container'>
        <div className={styles.newsListTitleArea}>
          {field_title &&
            <h2>{field_title}</h2>
          }
          {field_short_list &&
            <a href={t('list.news_url')}>{t('list.show_all_news')} <IconArrowRight size="l" /></a>
          }
        </div>
        {field_news_list_desc?.processed &&
          <div className={styles.newsListDescription}>
            <HtmlBlock field_text={field_news_list_desc} />
          </div>
        }
        <div className={`${styles.newsList} ${field_short_list && styles.short}`}>
          { paginatedNews && paginatedNews.map((news: any, key: any) => (
            <div className={styles.newsCard} key={key}>
                <a href={getPathAlias(news.path)}>
                  <h3 className={styles.newsTitle}>{news.title}</h3>
                </a>
              {news.published_at && <p className={styles.articleDate}><time dateTime={news.published_at}>{`${dateformat(news.published_at, 'dd.mm.yyyy')}`}</time></p>}
            </div>
          ))}
        </div>
        {paginatedNews && total > paginatedNews.length && (
          <div className={styles.loadMore}>
            <HDSButton
              variant='supplementary'
              iconRight={<IconPlus />}
              style={{ background: 'none' }}
              onClick={() => {
                setNewsIndex(newsIndex + 1)
              }}
            >
              {loadMoreText}
            </HDSButton>
          </div>
        )}
      </Container>
    </div>
  )
}

export default NewsList
