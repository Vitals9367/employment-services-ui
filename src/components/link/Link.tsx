import { IconArrowRight, IconArrowTopRight } from 'hds-react'
import { isExternalLink } from '@/lib/helpers'
import styles from './link.module.scss'

interface LinkProps {
  href: string
  text: string
}

function Link(props: LinkProps): JSX.Element {
  const { href, text} = props;

  return (
    <a href={href} className={`${styles.link} ${isExternalLink(href) ? styles.external : styles.internal }`}>
      <span>{text}</span>
      {isExternalLink(href) ? <IconArrowTopRight size="l" /> : <IconArrowRight size="l" />}
    </a>
  );
}

export default Link;
