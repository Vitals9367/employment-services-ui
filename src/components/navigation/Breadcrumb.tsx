import { IconAngleRight, IconArrowRight } from 'hds-react';
import Link from 'next/link';
import { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';

import classNames from '@/lib/classNames';
import { BreadcrumbContent } from '@/lib/types';

import styles from './navigation.module.scss';
import { languageFrontPages } from '@/lib/helpers';
import { getDrupalClient } from '@/lib/drupal-client';

interface BreadcrumbProps {
  breadcrumb: BreadcrumbContent[];
  locale: string | undefined;
}

export const Breadcrumb = ({
  breadcrumb,
  locale,
}: BreadcrumbProps): JSX.Element => {
  const { t } = useTranslation('common');
  let x;
  if (!breadcrumb || breadcrumb.length == 0) return <></>;

  const crumbs: ReactElement[] = breadcrumb.map((crumb, index) => {
    if (index == breadcrumb.length - 1) {
      return (
        <div className={styles.breadcrumbElement} key={crumb.id}>
          <span>{crumb.title}</span>
        </div>
      );
    }
    return (
      <div className={styles.breadcrumbElement} key={crumb.id}>
        <Link href={crumb.url}>
          <a>
            <span>{crumb.title}</span>
          </a>
        </Link>
        <IconAngleRight size="s" aria-hidden="true" />
      </div>
    );
  });

  switch (locale) {
    case 'uk':
      x = languageFrontPages.uk;
      break;
    case 'so':
      x = languageFrontPages.so;
    case 'ru':
      x = languageFrontPages.ru;
      break;
    default:
      x = '/';
      break;
  }

  return (
    <nav
      className={classNames(styles.breadcrumb)}
      aria-label={t('navigation.breadcrumb_label')}
    >
      <div className={styles.breadcrumbElement} key="breadcrumb-frontpage">
        <Link href={`${x}`}>
          <a>
            <span>{t('navigation.frontpage')}</span>
          </a>
        </Link>
        <IconAngleRight size="s" aria-hidden="true" />
      </div>
      {crumbs}
    </nav>
  );
};
