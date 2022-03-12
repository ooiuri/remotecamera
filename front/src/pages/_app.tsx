import GlobalStyles from  '../styles/globals'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Remote Camera</title>
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="description"
          content="Um projeto para controlar cameras remotamente."
        />
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  )
}
export default MyApp