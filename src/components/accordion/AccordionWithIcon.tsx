import {
  IconAngleUp,
  IconAngleDown,
  Button,
  Card,
  useAccordion,
  Container,
} from 'hds-react';

import styles from './accordion.module.scss';
import { ReactChildren, PropsWithChildren } from 'react';

interface AccordionProps {
  leftIcon: JSX.Element;
  accordionTitle: string;
  ariaLabel: string;
  backgroundColor: React.CSSProperties;
  children: ReactChildren | PropsWithChildren<any>;
}

function AccordionWithIcon({
  leftIcon,
  accordionTitle,
  ariaLabel,
  backgroundColor,
  children, 
}: AccordionProps): JSX.Element {
  const initiallyOpen = false;
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen });

  const icon = isOpen ? (
    <IconAngleUp size="l" aria-hidden />
  ) : (
    <IconAngleDown size="l" aria-hidden />
  );
  return (
    <Container className={styles.accordionContainer} style={backgroundColor}>
      <div className={styles.accordion}></div>
      <Button
        {...buttonProps}
        className={styles.iconAccordionButton}
        style={backgroundColor}
      >
        <div className={styles.iconAccordionHeaderText}>
          {leftIcon}
          <h3>{accordionTitle}</h3>
        </div>
        <div className={styles.iconAccordionHeaderIcon}>{icon}</div>
      </Button>
      <Card aria-label={ariaLabel} style={backgroundColor} {...contentProps}>
        {children}
      </Card>
    </Container>
  );
}

export default AccordionWithIcon;
