import type { NextPage } from 'next'
import React from 'react'
import Head from 'next/head'

import Navbar from '../components/Navbar'
import CurrentRoundInfo from '../components/CurrentRoundInfo'
import Panel from '../components/Panel'
import RoundList from '../components/RoundList'
import ClaimPrizeDialog from '../components/ClaimPrizeDialog'
import Footer from '../components/Footer'

const MainApp: NextPage = () => {
  return (
    <>
      <Head>
        <title>Punk Gacha</title>
      </Head>
      <div className="antialiased bg-black min-h-screen">
        <Navbar displayWalletState displayFAQ />
        <main className="flex flex-col items-center">
          <section className="w-full px-6 mx-auto md:px-8 max-w-[52rem] space-y-6 py-10">
            <CurrentRoundInfo />
            <Panel />
            <RoundList />
            <Footer />
          </section>
        </main>
        <ClaimPrizeDialog />
      </div>
    </>
  )
}

export default MainApp
