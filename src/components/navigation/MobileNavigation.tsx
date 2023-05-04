import { Navigation } from 'hds-react';
import { useTranslation } from 'next-i18next';

import styles from './navigation.module.scss';
import classNames from '@/lib/classNames';
import { NavigationProps } from '@/lib/types';
import LanguageSelect from './LanguageSelect';
import { getNav } from './Header';


export default function MobileNavigation({
  locale,
  onSearch,
  hideNav,
  menu,
  activePath,
  setOpen,
  open,
  langLinks,
}: NavigationProps) {
  const { t } = useTranslation('common');
  return (
    <div className={styles.mobileNav}>
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
            onSignIn={() => {
              window.open(t('navigation.button_link'), '_blank')?.focus();
            }}
            className={styles.blueButton}
          />
        </Navigation.Actions>

        {!hideNav && (
          <Navigation.Row>{getNav(menu, activePath)}</Navigation.Row>
        )}
      </Navigation>
      <LanguageSelect
        setOpen={setOpen}
        open={open}
        langLinks={langLinks}
        activePath={activePath}
      />
    </div>
  );
}
