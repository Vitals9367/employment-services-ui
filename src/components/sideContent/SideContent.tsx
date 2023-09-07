import React, { ReactElement } from 'react';

import styles from './sideContent.module.scss';

interface SideContent {
    header: string;
    field: any;
    icon: ReactElement;
}

function SideContent({ header, field, icon }: SideContent) {
  return (
    <div className={styles.contentRegionWrapper}>
      <div className={styles.headerContent}>
        {icon}
        <h2 className={styles.contentRegionSubHeader}>{header}</h2>
      </div>
      <div className={styles.contentRegionText}>{field}</div>
    </div>
  );
}

export default SideContent;
