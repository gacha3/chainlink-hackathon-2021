import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="crossOrigin" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="World's first decentralized lottery for CryptoPunks. Secured by Chainlink."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://punk.gacha.in" />
          <meta property="og:title" content="Punk Gacha" />
          <meta
            property="og:description"
            content="World's first decentralized lottery for CryptoPunks. Secured by Chainlink."
          />
          <meta property="og:image" content="/banner.png" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://punk.gacha.in" />
          <meta property="twitter:title" content="Punk Gacha" />
          <meta
            property="twitter:description"
            content="World's first decentralized lottery for CryptoPunks. Secured by Chainlink."
          />
          <meta property="twitter:image" content="/banner.png" />
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
