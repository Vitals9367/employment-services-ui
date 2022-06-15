import { allowedEventTags } from '@/lib/helpers'

import styles from './events.module.scss'


export interface TagListProps {
  tags: string[]
}

function TagList(props: TagListProps): JSX.Element {
  const { tags } = props

  // Prioritise tags order by allowedEventTags.
  tags.sort((a: string, b: string) => allowedEventTags.indexOf(a) - allowedEventTags.indexOf(b))
  const finalTags = tags.slice(0,3).map((tag: string) => tag.replace('_', ' '))

  return (
    <>
      {finalTags.length && 
        <ul className={styles.tags}>
          { Object.values(finalTags).map((tag: string, i: number) => (
            <li className={styles.tag} key={`${tag}-${i}`}>
              { tag }
            </li>
          ))}
        </ul>
      }
    </>
  )
}

export default TagList
