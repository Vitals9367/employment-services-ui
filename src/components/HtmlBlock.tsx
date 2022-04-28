import parse from 'html-react-parser'

interface HtmlBlockProps {
  field_text: any
}

export function HtmlBlock({ field_text }: HtmlBlockProps): JSX.Element {
  // console.log('field_text', field_text)
  return (
    <div>
      {parse(field_text?.processed)}
    </div>
  )
}

export default HtmlBlock