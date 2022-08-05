import { GetStaticPropsContext } from 'next'
import { Locale } from 'next-drupal'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Link from '@/components/link/Link'
import getMenu from '@/lib/get-menu'
import { Layout } from '@/components/layout/Layout'
import { NavProps, FooterProps } from '@/lib/types'

const notFoundTexts = {
  fi: {
    text: "Sivua ei valitettavasti löytynyt.",
    linkText: "Palaa etusivulle"
  },
  sv: { text: "Sidan hittades inte.", linkText: "Gå till startsidan" },
  en: {
    text: "Sorry! We can't find the page you were looking for.",
    linkText: "Return to our Homepage"
  }
}

interface PageNotFoundProps {
  nav: NavProps
  footer: FooterProps
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { locale, defaultLocale } = context as { locale: Locale, defaultLocale: Locale }

  const langLinks = { fi: '/', en: '/en', sv: '/sv'}
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
    revalidate: 3600
  }
}

export const PageNotFound = ({ nav, footer }: PageNotFoundProps) => {
  const { locale } = useRouter()

  let texts = notFoundTexts.fi
  switch (locale) {
    case 'sv':
      texts = notFoundTexts.sv
      break
    case 'en':
      texts = notFoundTexts.en
      break
    case 'fi':
    default:
      texts = notFoundTexts.fi
      break
  }

  return (
    <Layout header={nav} footer={footer}>
      <div className="columns not-found">
        <div className="col-12">
          <h1>{texts.text}</h1>
          <Link
            href={`/${locale}`}
            text={texts.linkText}
          />
        </div>
      </div>
    </Layout>
  )
}

export default PageNotFound
