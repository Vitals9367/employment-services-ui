import parse from 'html-react-parser'

interface HtmlBlockProps {
  field_text: {
    format: string
    processed: string
    value: string
  }
}

export function HtmlBlock({ field_text }: HtmlBlockProps): JSX.Element {
  return (
    <div>
      {parse(field_text?.processed)}
    </div>
  )
}

export default HtmlBlock