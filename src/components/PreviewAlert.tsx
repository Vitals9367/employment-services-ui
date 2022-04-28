import * as React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export function PreviewAlert() {
  const { isPreview } = useRouter()
  const [showPreviewAlert, setShowPreviewAlert] = React.useState<boolean>(false)

  React.useEffect(() => {
    setShowPreviewAlert(isPreview && window.top === window.self)
  }, [isPreview])

  if (!showPreviewAlert) {
    return null
  }

  return (
    <div>
      <p>
        This page is a preview.
        <Link href="/api/exit-preview" passHref prefetch={false}>
          <a>Click here</a>
        </Link>
        to exit preview mode.
      </p>
    </div>
  )
}
