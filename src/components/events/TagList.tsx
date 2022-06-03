import styles from './events.module.scss'


export interface TagListProps {
  tags: Array<string>
}

function TagList(props: TagListProps): JSX.Element {
  const { tags } = props

  const allowedTags = ['maahanmuuttajat', 'nuoret', 'info', 'koulutus', 'messut', 'neuvonta', 'rekrytointi', 'työpajat', 'digitaidot', 'etätapahtuma', 'palkkatuki', 'työnhaku']
  // Prioritise tags order by allowedTags.
  tags.sort((a: string, b: string) => allowedTags.indexOf(a) - allowedTags.indexOf(b))
  const finalTags = tags.slice(0,3).map((tag: string) => tag === 'maahanmuuttajat' ? 'maahan muuttaneet' : tag);
  
  return (
    <>
      {finalTags.length !== 0 && 
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
