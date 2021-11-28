import '../styles/globals.css'
import '../styles/inter.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { UseWalletProvider } from 'use-wallet'
import { CHAIN_ID, JSON_PRC_URL } from '../utils/const'
import queryClient from '../api/queryClient'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { punkGachaContract, PunkGachaContractProvider } from '../contexts/PunkGachaContract'
import { cryptoPunksContract, CryptoPunksContractProvider } from '../contexts/CryptoPunksContract'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UseWalletProvider
        autoConnect={true}
        connectors={{
          walletconnect: {
            rpc: { [CHAIN_ID]: JSON_PRC_URL },
            bridge: 'https://bridge.walletconnect.org',
          },
        }}
      >
        <CryptoPunksContractProvider value={cryptoPunksContract}>
          <PunkGachaContractProvider value={punkGachaContract}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </PunkGachaContractProvider>
        </CryptoPunksContractProvider>
      </UseWalletProvider>
    </QueryClientProvider>
  )
}

export default MyApp
