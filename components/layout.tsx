import Link from "next/link"

import { PreviewAlert } from "@/components/preview-alert"
import Nav from "./Nav"
import { DrupalMenuLinkContent } from "next-drupal"

interface LayoutProps {
  children: any,
  menu: DrupalMenuLinkContent[],
}

export function Layout({ children, menu }: LayoutProps): JSX.Element {
  return (
    <>
      <PreviewAlert />
      <div>
        <header>
          <div>
            <Link href="/" passHref>
              <a>
                Next.js for Drupal
              </a>
            </Link>
            <Nav menu={menu}/>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </>
  )
}
