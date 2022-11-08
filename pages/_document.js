// Code from: https://hds.hel.fi/foundation/guidelines/server-side-rendering/
// TODO: add typescript for this file.
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { getCriticalHdsRules, hdsStyles } from 'hds-react'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const hdsCriticalRules = await getCriticalHdsRules(initialProps.html, hdsStyles);

    return {...initialProps, hdsCriticalRules}
  }

  render() {
    return (
      <Html>
        <Head>
          <style data-used-styles dangerouslySetInnerHTML={{ __html: this.props.hdsCriticalRules }} />
          { process.env.NEXT_PUBLIC_SITE_URL !== 'https://tyollisyyspalvelut.hel.fi' && 
            <meta name="robots" content="noindex, nofollow" />
          }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
