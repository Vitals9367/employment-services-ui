import { Locale } from 'next-drupal'
import getConfig from 'next/config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import parse from 'html-react-parser'
import { Layout } from '@/components/layout/Layout';
import { Button, Container, Pagination, SearchInput, RoundedTag } from 'hds-react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { NavProps, FooterProps } from '@/lib/types'
import getMenu from '@/lib/get-menu'
import { useEffect, useState } from 'react';
import { getSearch } from '@/lib/client-api';
import { integer } from '@elastic/elasticsearch/lib/api/types';
import { useRouter } from 'next/router';

type SearchInputValue = string | undefined

interface SearchPageProps {
  nav: NavProps
  footer: FooterProps
}

interface QueryParams {
  q: SearchInputValue
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<SearchPageProps>> {
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }
  const { REVALIDATE_TIME } = getConfig().serverRuntimeConfig  
  const langLinks = { fi: '/search', en: '/en/search', sv: '/sv/search'}
  const { tree: menu } = await getMenu('main', locale, defaultLocale)
  const { tree: themes } = await getMenu('additional-languages', locale, defaultLocale)
  const { tree: footerNav } = await getMenu('footer', locale, defaultLocale)

  return {
    props: {
      nav: {
        locale,
        menu,
        themes,
        langLinks,
      },
      footer: {
        locale,
        footerNav,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: REVALIDATE_TIME
  }
}

const ItemBlock = (props: any): JSX.Element => {
  const getText = (content: any): string | JSX.Element | JSX.Element[] => {
    if (content.field_lead_in !== undefined) {
      return parse(content.field_lead_in[0])
    }
  
    if (content.field_description !== undefined) {
      return parse(content.field_description[0])
    }

    return ''
  }

  const content = props.result
  const title = content.title[0]
  const text = getText(content)
  const url = content.url === undefined ? '#' : content.url[0]

  return (
    <div className="item">
      <h3>{title}</h3>
      <div className="item-text">
        {text}
      </div>
      { props.badgeText && 
        <div className="item-badge">
          <RoundedTag aria-label={props.badgeText} theme={{'--tag-background': '#ffffff' }}>{props.badgeText}</RoundedTag>
        </div>
      }
      <a href={url} className="item-link"><span>{props.linkText}</span></a>
    </div>
  )
}

export default function Search({ nav, footer }: SearchPageProps) {
  const router = useRouter()
  const { q }: QueryParams = router.query as any
  const locale: Locale = router.locale as any
  const { t } = useTranslation('common')
  const [ results, setResults ] = useState<any>()
  const [ total, setTotal ] = useState<integer>(0)
  const [ searchValue, setSearchValue ] = useState<SearchInputValue>('')
  const [ pageIndex, setPageIndex ] = useState(0);
  const [ pages, setPages ] = useState(0)

  const getPages = (totalResults: number) => {
    const querySize = 20
    const diff = totalResults / querySize
    const round = Math.round(diff)

    return round >= diff ? round : round + 1
  }

  /**
   * @TODO Find a solution to fetch / display search suggestions.
   */
  const getSuggestions = async (inputValue: SearchInputValue) => {
    const searchResults =  await getSearch(pageIndex, inputValue, locale)
    const suggestions = searchResults.results.map((result: any, key: any) => {
      return {'value': result.title[0]}
    }).filter((current: any, index: number, self: any) =>
        index === self.findIndex((diff: any) => (
          diff.value === current.value
        ))
      )

    return suggestions
  }

  const updateSearchValue = (inputValue: SearchInputValue) => {
    setSearchValue(inputValue)
  }

  const onSubmit = (inputValue: SearchInputValue) => {
    if (inputValue === '') return

    router.replace(
      { query: { q: inputValue } },
      undefined,
      { shallow: true }
    );
  }

  const hasBadge = (type: string) => {
    if (type === 'event' || type === 'article') {
      return t(`search.entity_type_${type}`)
    }
    return false
  }

  useEffect(() => {   
    const validateQuery = () => {
      if (q === undefined || q === '') {
        return false
      }
      return true
    }
    
    if (!router.isReady || !validateQuery()) return

    updateSearchValue(q)

    getSearch(pageIndex, q, locale).then((data) => {
      setResults(data.results)
      setTotal(data.total)
      setPages(getPages(data.total))
    })

  }, [router.isReady, q, pageIndex])

  return (
    <Layout header={nav} footer={footer}>
      <Head>
        <title>{t('site_title')}</title>
      </Head>
      <article className="search-page">
        <Container className="container">

          <h1>{t('search.title')}</h1>

          <SearchInput        
            onSubmit={onSubmit}
            onChange={updateSearchValue}
            // getSuggestions={getSuggestions}
            suggestionLabelField="value"
            placeholder={t('search.input_placeholder')}
            label={t('search.input_label')}
            hideSearchButton
            value={searchValue}
          />

          <Button
            className="search-button"
            theme="black"
            onClick={() => onSubmit(searchValue)}
            style={{marginTop: "20px"}}
          >
            {t('search.input_submit')}
          </Button>

        { results && 
          <div id="search-results" style={{margin: "40px auto"}}>

            <div className="summary">
              <h2>{`${t('search.keyword')} "${q}"`}</h2>
              <p><strong>{total}</strong> {t('search.result_text')}</p>
            </div>

            {results.map((result: any, key: any) => {
              return (
                <ItemBlock 
                  {...{
                    result, 
                    linkText: t('search.item_link_text'),
                    badgeText: result.type !== undefined ? hasBadge(result.type[0]) : false
                  }}
                  key={key} 
                />
              )
            })}

          { pages > 1 && 
            <Pagination
              language={locale as any}
              onChange={(event, index) => {
                event.preventDefault()
                setPageIndex(index)
                setTimeout(() => {
                  window.scrollTo({
                    top: 100,
                    left: 100,
                    behavior: 'smooth'
                  })
                }, 1000)
              }}  
              pageCount={pages}
              pageHref={() => '#'}
              pageIndex={pageIndex}
              paginationAriaLabel={t('search.pagination_aria_label')}
              siblingCount={2}
            />
          }
          </div>
        }
        </Container>
      </article>
    </Layout>
  )
}
