import { useState, useRef, ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { Navigation, Button, IconAngleRight, IconArrowTopRight, IconGlobe } from 'hds-react'
import { NavProps } from 'src/lib/types'
import styles from './navigation.module.scss'
import { DrupalMenuLinkContent } from 'next-drupal'
import { Breadcrumb } from './Breadcrumb'

function Header(header:NavProps): JSX.Element {

  const { locale, menu, themes, langLinks, breadcrumb } = header
  const { t } = useTranslation('common')

  const activePath = langLinks[locale]

  const getNavi = (menuArray: DrupalMenuLinkContent[]|undefined) => {
    const nav: ReactElement[] = [];
    if (!menuArray) {
      return <></>
    }

    menuArray.map((item: DrupalMenuLinkContent, index: number) => {
      const subs: ReactElement[] = [];
      item.items?.map((sub: DrupalMenuLinkContent, i: number) => {
        subs.push(
          <Navigation.Item
            key={sub.title}
            as="a"
            href={sub.url}
            label={sub.title}
            active={sub.url === activePath}
          />
        )
        return subs
      })
      nav.push(
        <Navigation.Dropdown label={item.title} key={item.title} id={item.title} className={styles.zover}>
          {subs}
        </Navigation.Dropdown>
      )
      return nav
    })
    return nav
  }

  const getThemes = (links: DrupalMenuLinkContent[]|undefined) => {
    if (!links) {
      return <></>
    }
    const nav: ReactElement[] = []
    links.map((item: DrupalMenuLinkContent, index: number) => {
      nav.push(
        <Navigation.Item
          key={item.title}
          href={item.url}
          label={item.title}
          lang="und"
          active={item.url === activePath}
        />
      )
    })
    return nav
  }

  if (!menu&&!themes&&!langLinks) {
    return <></>
  }

  return (
    <>
    <Navigation
      menuToggleAriaLabel="Menu"
      logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
      skipTo="#content"
      skipToContentLabel="Skip to main content"
      title={t('site_name')}
      titleAriaLabel={t('navigation.title_aria_label')}
    >
      <Navigation.Actions>
        <Navigation.Row variant='inline' key='languages'>
          <Navigation.Item
            key="fi_lang"
            href={langLinks.fi}
            hrefLang='fi'
            label="Suomeksi"
            active={langLinks.fi === activePath}
          />
          <Navigation.Item
            key="sv_lang"
            href={langLinks.sv}
            hrefLang='sv'
            label="På svenska"
            active={langLinks.sv === activePath}
          />
          <Navigation.Item
            key="en_lang"
            href={langLinks.en}
            hrefLang='en'
            label="In English"
            active={langLinks.en === activePath}
          />
          <Navigation.Dropdown label="" aria-label={t("navigation.theme_dropdown")} icon={<IconGlobe size='s' aria-label="Globe"/>} key='theme_dropdown' id='theme_dropdown'>
            {getThemes(themes)}
          </Navigation.Dropdown>

        </Navigation.Row>
        <Button
            size="small"
            id='navigation_button'
            key='navigation_button'
            iconRight={<IconArrowTopRight size="l" />}
            onClick={() => {
              window.open(t('navigation.button_link'), '_blank')?.focus();
            }}
          >
            {t('navigation.button_text')}
          </Button>
      </Navigation.Actions>
      <Navigation.Row>
        {getNavi(menu)}
      </Navigation.Row>
    </Navigation>
    {activePath !== '/' && <Breadcrumb breadcrumb={breadcrumb}/>}
    </>
  );
}

export default Header;
