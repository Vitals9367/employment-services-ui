import { Button, IconLinkExternal } from 'hds-react';
import { Navigation as NavigationHDS } from 'hds-react';
import { useTranslation } from 'next-i18next';

import classNames from '@/lib/classNames';
import { getNav } from './Header';
import styles from './navigation.module.scss';
import LanguageSelect from './LanguageSelect';

interface NavigationProps {
  locale: any;
  onSearch: any;
  hideNav: any;
  menu: any;
  activePath: any;
  setOpen: any;
  langLinks: any;
  onClick?: any;
  open: any;
}

export default function Navigation({
  locale,
  hideNav,
  menu,
  activePath,
  setOpen,
  langLinks,
  onSearch,
  onClick,
  open,
}: NavigationProps) {
  const { t } = useTranslation('common');
  return (
    <div className={styles.mainNav}>
      <NavigationHDS
        menuToggleAriaLabel="Menu"
        logoLanguage={locale === 'sv' ? 'sv' : 'fi'}
        skipTo="#content"
        skipToContentLabel={t('skip-to-main-content')}
        title={t('site_name')}
        titleAriaLabel={t('navigation.title_aria_label')}
        titleUrl={locale === 'fi' ? '/' : `/${locale}`}
        className={classNames(styles.navigation, styles.zover)}
      >
        <NavigationHDS.Actions>
          <LanguageSelect
            setOpen={setOpen}
            open={open}
            langLinks={langLinks}
            activePath={activePath}
          />
          <NavigationHDS.Search
            onSearch={onSearch}
            searchLabel={t('navigation.search_label')}
            searchPlaceholder={t('navigation.search_placeholder')}
          />
          <Button
            className={styles.loggingButton}
            onClick={onClick}
            iconRight={<IconLinkExternal size="s" aria-hidden="true" />}
          >
            {t('navigation.button_text')}
          </Button>
        </NavigationHDS.Actions>
        {!hideNav && (
          <NavigationHDS.Row>{getNav(menu, activePath)}</NavigationHDS.Row>
        )}
      </NavigationHDS>
    </div>
  );
}
