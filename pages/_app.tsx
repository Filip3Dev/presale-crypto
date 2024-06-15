import NextApp, { AppProps, AppContext } from 'next/app';
import { Exo } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';
import Head from 'next/head';
import { MantineProvider, ColorScheme } from '@mantine/core';
import { WagmiConfig, createConfig } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
// eslint-disable-next-line import/extensions
import 'public/app.css';
import { useEffect } from 'react';
import { GTM_ID } from '@/constants';
import { gtmPageView } from '@/lib/gtm';

// google font
const exoFont = Exo({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
});

// connectKit + wagmi
const config = createConfig(
  getDefaultConfig({
    appName: 'CLTS Pre-sale App',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [bscTestnet],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;

  useEffect(() => {
    const prop = {
      page_title: pageProps.slug || null,
    };
    gtmPageView(prop);
  }, [pageProps]);

  return (
    <>
      <Head>
        <title>Credit Ledger | Pre-sale</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="https://ik.imagekit.io/abkvohwfl/creditLedger%20logo_YmvotYmaL.png" />
      </Head>

      <MantineProvider
        theme={{
          colorScheme: 'dark',
          fontFamily: exoFont.style.fontFamily,
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <WagmiConfig config={config}>
          <ConnectKitProvider debugMode>
            <Component {...pageProps} />
          </ConnectKitProvider>
        </WagmiConfig>
      </MantineProvider>
      <GoogleTagManager gtmId={GTM_ID} />
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
  };
};
