import {
  IconAngleUp,
  IconAngleDown,
  Button,
  Card,
  useAccordion,
  Container,
} from 'hds-react';

import styles from './accordion.module.scss';

interface AccordionProps {
  leftIcon: JSX.Element;
  accordionTitle: string;
  ariaLabel: string;
  backgroundColor: React.CSSProperties;
  data: [
    {
      group: string;
      value: string;
    }
  ];
}

function AccordionWithIcon({
  leftIcon,
  accordionTitle,
  ariaLabel,
  backgroundColor,
  data,
}: AccordionProps): JSX.Element {
  const groups: string[] = [];
  data.map((item) =>
    groups.indexOf(item.group) === -1 ? groups.push(item.group) : null
  )
  const initiallyOpen = false
  const {isOpen, buttonProps, contentProps} = useAccordion({initiallyOpen})

  const icon = isOpen ? (
    <IconAngleUp size='l' aria-hidden />
  ) : (
    <IconAngleDown size='l' aria-hidden />
  )
  return (
    <Container className='container' style={backgroundColor}>
      <div className={styles.accordion}></div>
      <Button
        {...buttonProps}
        className={styles.iconAccordionButton}
        style={backgroundColor}>
        <div className={styles.iconAccordionHeaderText}>
          {leftIcon}
          <h3>{accordionTitle}</h3>
        </div>
        <div className={styles.iconAccordionHeaderIcon}>{icon}</div>
      </Button>
      <Card aria-label={ariaLabel} style={backgroundColor} {...contentProps}>
        {groups.map((groupName, i) => (
          <div key={i}>
            <h3>{groupName}</h3>
            {Object.values(data).map((group, key) => (
              <div key={key}>
                <ul>
                  {groupName === group.group ? <li>{group.value}</li> : null}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </Card>
    </Container>
  )
}

export default AccordionWithIcon
