import React from "react";
import { Accordion as HDSAccordion, useAccordion, Button, Card, IconAngleUp, IconAngleDown } from 'hds-react';

import ContentMapper from '@/components/ContentMapper'
import HtmlBlock from '@/components/HtmlBlock'
import { DrupalFormattedText } from 'src/lib/types'
import styles from './accordion.module.scss'


interface AccordionProps {
  field_accordion_type: 'basic' | 'numbered'
  field_accordion_title_level: string
  field_accordion_title: string
  field_accordion_text: DrupalFormattedText
  field_accordion_items: Array<{
    field_accordion_item_heading: string
    field_accordion_item_content: any
  }>;
  field_accordion_heading_level: number
}

function Accordion(props: AccordionProps): JSX.Element {
  const { field_accordion_type, field_accordion_title, field_accordion_title_level, field_accordion_text, field_accordion_items, field_accordion_heading_level } = props;
  const HeadingTag = `h${field_accordion_title_level}` as keyof JSX.IntrinsicElements;

  return (
    <div className='component'>
      {field_accordion_title && 
        <HeadingTag>{field_accordion_title}</HeadingTag>
      }

      {field_accordion_text?.processed && 
        <HtmlBlock field_text={field_accordion_text} />
      }

      {field_accordion_items.map(
        (
          {
            field_accordion_item_content,
            field_accordion_item_heading,
            id,
            type,
          }: any,
          i: number
        ) => {
          return field_accordion_type === 'basic'
            ? (
            <HDSAccordion
              id={id}
              key={`${type}-${id}`}
              heading={field_accordion_item_heading}
              headingLevel={field_accordion_heading_level}
              theme={{
                '--border-color': 'var(--color-black-20)',
                '--header-font-size': 'var(--fontsize-heading-m)',
                '--header-line-height': 'var(--lineheight-m)',
              }}
            >
              {field_accordion_item_content?.length > 0 && (
                <ContentMapper content={field_accordion_item_content}/>
              )}
            </HDSAccordion>
          ) : (
            <NumberedAccordion 
              id={id}
              index={i + 1}
              field_accordion_item_heading={field_accordion_item_heading}
              field_accordion_heading_level={field_accordion_heading_level}
              field_accordion_item_content={field_accordion_item_content}
            />
          )
        }
      )}
    </div>
  );
}

interface NumberedAccordionProps {
  id: string
  index: number
  field_accordion_item_heading: string
  field_accordion_item_content: any
  field_accordion_heading_level: number
}

function NumberedAccordion(props: NumberedAccordionProps): JSX.Element {
  const { id, index, field_accordion_item_heading, field_accordion_heading_level, field_accordion_item_content } = props
  
  // Handle accordion state with useAccordion hook
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen: false })

  // Change icon based on accordion open state
  const icon = isOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />

  return (
    <div className={styles.accordionHeading} id={id}>
      <Button iconRight={icon} aria-level={field_accordion_heading_level} aria-labelledby={`${id}-heading`} {...buttonProps} className={styles.button}>
        <span className={styles.number}>{index}</span>
        {field_accordion_item_heading}
      </Button>
      <div className={styles.accordionContent} aria-labelledby={`${id}-content`} role="region" {...contentProps}>
        {field_accordion_item_content?.length > 0 && (
          <ContentMapper content={field_accordion_item_content}/>
        )}
      </div>
    </div>
  );
}

export default Accordion
