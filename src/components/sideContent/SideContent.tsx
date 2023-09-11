import React, { PropsWithChildren, ReactChildren, ReactElement } from 'react';

import styles from './sideContent.module.scss';

interface SideContent {
    header: string;
    content: ReactChildren | PropsWithChildren<any>;
    icon: ReactElement;
}

function SideContent({ header, content, icon }: SideContent) {
  return (
    <div className={styles.contentRegionWrapper}>
      <div className={styles.headerContent}>
        {icon}
        <h2 className={styles.contentRegionSubHeader}>{header}</h2>
      </div>
      <div className={styles.contentRegionText}>{content}</div>
    </div>
  );
}

export default SideContent;
