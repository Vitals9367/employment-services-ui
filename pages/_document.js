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
