import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { DrupalMenuLinkContent } from 'next-drupal';
import { Navigation as NavigationHDS } from "hds-react";


import { NavProps } from '@/lib/types';
import classNames from '@/lib/classNames';
import { printablePages } from '@/lib/helpers';
import { Breadcrumb } from './Breadcrumb';
import styles from './navigation.module.scss';
import PrintButton from '../printButton/PrintButton';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';

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

  if (!menu && !themes && !langLinks) {
    return <></>;
  }

  const onSearch = (searchValue: string) => {
    router.push(`/search?q=${searchValue}`, undefined, { shallow: true });
  };

  const onClick = () => {
    window.open(t('navigation.button_link'), '_blank')?.focus();
  }

  return (
    <>
      <Navigation
        locale={locale}
        onSearch={onSearch}
        hideNav={hideNav}
        menu={menu}
        activePath={activePath}
        setOpen={setOpen}
        open={open}
        langLinks={langLinks}
        onClick={onClick}
      />

      <MobileNavigation
        locale={locale}
        onSearch={onSearch}
        hideNav={hideNav}
        menu={menu}
        activePath={activePath}
        setOpen={setOpen}
        open={open}
        langLinks={langLinks}
      />

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


export const getNav = (menuArray: DrupalMenuLinkContent[] | undefined, activePath: any) => {
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
        <NavigationHDS.Item
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
      <NavigationHDS.DropdownLink
        label={item.title}
        key={item.title}
        id={item.title}
        active={isActive}
        className={classNames(styles.navDropDown, isActive && styles.active)}
        href={item.url}
      >
        {subs}
      </NavigationHDS.DropdownLink>
    );
    return nav;
  });
  return nav;
};
