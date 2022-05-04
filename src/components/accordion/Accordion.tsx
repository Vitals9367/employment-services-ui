import React from "react";
import { Accordion as HDSAccordion } from 'hds-react'
import ContentMapper from '@/components/ContentMapper'
import HtmlBlock from '@/components/HtmlBlock'
import { DrupalFormattedText } from 'src/lib/types'


interface AccordionProps {
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
  const { field_accordion_title, field_accordion_title_level, field_accordion_text, field_accordion_items, field_accordion_heading_level } = props;
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
          return (
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
          )
        }
      )}
    </div>
  );
}

export default Accordion;
