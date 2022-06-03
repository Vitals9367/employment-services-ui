import parse from 'html-react-parser'
import { DrupalFormattedText } from 'src/lib/types'

interface HtmlBlockProps {
  field_text: DrupalFormattedText
}

export function HtmlBlock({ field_text }: HtmlBlockProps): JSX.Element {
  return (
    <div>
      {parse(field_text?.processed)}
    </div>
  )
}

export default HtmlBlock