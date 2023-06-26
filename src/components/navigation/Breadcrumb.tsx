import { IconAngleRight, IconArrowRight } from 'hds-react';
import Link from 'next/link';
import { Link } from 'hds-react';
import { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';

import classNames from '@/lib/classNames';
import { BreadcrumbContent } from '@/lib/types';

import styles from './navigation.module.scss';
import { previewNavigation } from '@/lib/helpers';
import { languageFrontPages, primaryLanguages } from '@/lib/helpers';

interface BreadcrumbProps {
  breadcrumb: BreadcrumbContent[];
  locale: string;
  preview: boolean | undefined;
}

export const Breadcrumb = ({
  breadcrumb,
  locale,
  preview,  
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
        <Link
          href={crumb.url}
          onClick={() => previewNavigation(crumb.url, preview)}
        >
          <a>
            <span>{crumb.title}</span>
          </a>
        </Link>
        <IconAngleRight size="s" aria-hidden="true" />
      </div>
    );
  });

const getFrontPageLink = (locale?: string) => {
  let frontPageLink;
  switch (locale) {
    case 'uk':
      frontPageLink = languageFrontPages.uk;
      break;
    case 'so':
      frontPageLink = languageFrontPages.so;
      break;
    case 'ru':
      frontPageLink = languageFrontPages.ru;
      break;
    default:
      frontPageLink = '/';
      break;
  }
  return frontPageLink;
}

  return (
    <nav
      className={classNames(styles.breadcrumb)}
      aria-label={t('navigation.breadcrumb_label')}
    >
      { (crumbs.length === 1 || primaryLanguages.includes(locale)) &&
      <div className={styles.breadcrumbElement} key="breadcrumb-frontpage">
        <Link href={`${getFrontPageLink(locale)}`} onClick={() => previewNavigation(`${getFrontPageLink(locale)}`, preview)}>
          <a>
            <span>{t('navigation.frontpage')}</span>
          </a>
        </Link>
        <IconAngleRight size="s" aria-hidden="true" />
      </div>
      }
      {crumbs}
    </nav>
  );
};
