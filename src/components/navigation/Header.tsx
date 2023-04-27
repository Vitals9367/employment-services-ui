import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { DrupalMenuLinkContent } from 'next-drupal';
import { Navigation, IconArrowTopRight, Link, Select, IconGlobe, Button, IconAngleDown, IconAngleUp} from 'hds-react';
// import Link from 'next/link';

import { NavProps } from '@/lib/types';
import classNames from '@/lib/classNames';
import { printablePages } from '@/lib/helpers';
import { Breadcrumb } from './Breadcrumb';
import styles from './navigation.module.scss';
import PrintButton from '../printButton/PrintButton';

function Header(header: NavProps): JSX.Element {
  const { locale, menu, themes, langLinks, breadcrumb, hideNav } = header;
  const { t } = useTranslation('common');
  const router: any = useRouter(); // @TODO Fix type for proper
  const activePath = langLinks[locale ? locale : 'fi'];
  const [pageProps, setPageProps]: any | null = useState(null);
  const [isPrintable, setIsPrintable] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setPageProps(router.components[router.route].props.pageProps);

    if (!pageProps || pageProps.node === undefined) return;

    if (printablePages.includes(pageProps.node.type)) {
      setIsPrintable(true);
    }
  }, [pageProps]);

  const getNav = (menuArray: DrupalMenuLinkContent[] | undefined) => {
    const nav: ReactElement[] = [];
    if (!menuArray) {
      return <></>;
    }
    menuArray.map((item: DrupalMenuLinkContent, index: number) => {
      const subs: ReactElement[] = [];
      let childActive = false;
      item.items?.map((sub: DrupalMenuLinkContent, i: number) => {
        childActive = sub.url === activePath || childActive;
        subs.push(
          <Navigation.Item
            key={sub.title}
            as="a"
            href={sub.url}
            label={sub.title}
            active={sub.url === activePath}
          />
        );
        return subs;
      });
      const isActive = item.url === activePath || childActive;
      nav.push(
        <Navigation.DropdownLink
          label={item.title}
          key={item.title}
          id={item.title}
          active={isActive}
          className={classNames(styles.navDropDown, isActive && styles.active)}
          href={item.url}
        >
          {subs}
        </Navigation.DropdownLink>
      );
      return nav;
    });
    return nav;
  };

  if (!menu && !themes && !langLinks) {
    return <></>;
  }

  const onSearch = (searchValue: string) => {
    router.push(`/search?q=${searchValue}`, undefined, { shallow: true });
  };

  return (
    <>
      <Navigation
        menuToggleAriaLabel="Menu"
        logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
        skipTo="#content"
        skipToContentLabel={t('skip-to-main-content')}
        title={t('site_name')}
        titleAriaLabel={t('navigation.title_aria_label')}
        titleUrl={locale === 'fi' ? '/' : `/${locale}`}
        className={classNames(styles.navigation, styles.zover)}
      >
        {!hideNav && <Navigation.Row>{getNav(menu)}</Navigation.Row>}
        <Navigation.Actions>
          <Navigation.Search
            onSearch={onSearch}
            searchLabel={t('navigation.search_label')}
            searchPlaceholder={t('navigation.search_placeholder')}
          />
          <Navigation.User
            id="navigation_blue_button"
            key="navigation_button"
            label={t('navigation.button_text')}
            icon={<IconArrowTopRight size="l" />}
            onSignIn={() => {
              window.open(t('navigation.button_link'), '_blank')?.focus();
            }}
            className={styles.blueButton}
          />
        </Navigation.Actions>
      </Navigation>
      <nav className={styles.LanguageSelector}>
        <div className={styles.languageSelect}>
          <Link aria-current={langLinks.fi === activePath} href={langLinks.fi}>
            Suomi
          </Link>
          <Link aria-current={langLinks.sv === activePath} href={langLinks.sv}>
            Svenska
          </Link>
          <Link aria-current={langLinks.en === activePath} href={langLinks.en}>
            English
          </Link>
        </div>
        <Button
          className={styles.buttonGlobe}
          onClick={() => setOpen(!open) }
          iconRight={!open ? <IconAngleDown size="s" /> : <IconAngleUp size="s" />}

        ><IconGlobe size="s" /></Button>

      </nav>
      {open && (
        <ul className={styles.box}>
          <li>Apple</li>
          <li>Banana</li>
          <li>Pear</li>
          <li>Cherry</li>
          <li>Grape</li>
          <li>Lemon</li>
        </ul>
      )}
      {activePath !== '/' && (
        <div className={styles.subHeader}>
          <Breadcrumb breadcrumb={breadcrumb} />
          {isPrintable && (
            <PrintButton
              onClick={() => window?.print()}
              buttonText={t('text_print')}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Header;
