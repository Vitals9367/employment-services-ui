import React, { PropsWithChildren, ReactChildren, ReactElement } from 'react';

import styles from './sideContent.module.scss';

interface SideContent {
    header: string;
    children: ReactChildren | PropsWithChildren<any>;
    icon: ReactElement;
}

function SideContent({ header, children, icon }: SideContent) {
  return (
    <div className={styles.contentRegionWrapper}>
      <div className={styles.headerContent}>
        {icon}
        <h2 className={styles.contentRegionSubHeader}>{header}</h2>
      </div>
      <div className={styles.contentRegionText}>{children}</div>
    </div>
  );
}

export default SideContent;
