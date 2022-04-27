import { PreviewAlert } from '@/components/PreviewAlert'
import { Container } from 'hds-react'
import styles from './layout.module.scss'

interface LayoutProps {
  children: any
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <PreviewAlert />
      <div className={styles.wrapper}>
        <header>
          <div>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <Container className="container">
            <div className="columns">
              <div className="col col-6">
                Menu placeholder
              </div>
              <div className="col col-6">
                Oma asiointi placeholder
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </>
  )
}

