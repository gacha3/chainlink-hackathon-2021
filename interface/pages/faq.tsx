import Head from 'next/head'
import React, { FC, memo, useMemo } from 'react'
import Navbar from '../components/Navbar'
import useServiceFeeThousandth from '../hooks/query/useServiceFeeThousandth'
import { NEXT_PUBLIC_ETHERSCAN_PREFIX, PUNKGACHA_ADDRESS } from '../utils/const'

interface Props {}

const Faq: FC<Props> = () => {
  const { data: serviceFeeThousandth } = useServiceFeeThousandth()

  const displayServiceFee = useMemo(() => {
    if (!serviceFeeThousandth) return '-'
    return serviceFeeThousandth.div(10).add(100).toString() + '%'
  }, [serviceFeeThousandth])
  return (
    <>
      <Head>
        <title>Punk Gacha | FAQ</title>
      </Head>
      <div className="antialiased bg-black min-h-screen">
        <Navbar displayApp />
        <main className="flex flex-col items-center">
          <section className="w-full px-6 mx-auto md:px-8 max-w-[50rem]">
            <section className="py-10">
              <article className="prose !prose-dark prose-sm sm:prose lg:prose-lg xl:prose-xl font-inter">
                <h1>FAQ</h1>
                <h2>What is Punk Gacha?</h2>
                <p>
                  Punk Gacha is the first on-chain lottery dedicated to CryptoPunks.{' '}
                  <a
                    href={`${NEXT_PUBLIC_ETHERSCAN_PREFIX}address/${PUNKGACHA_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Our smart contract
                  </a>{' '}
                  guarantees that it’s secure, perpetual, provably random and incorruptible.
                </p>
                <h2>How to play?</h2>
                <p>
                  It’s simple. The lottery is opened round by round, there is always one round
                  available at a time with a targeted CryptoPunk (which needs to be for sale).
                </p>
                <p>
                  You can bet multiple times with any amount of ETH you want. The probability is
                  calculated based on the total amount you bet with your wallet.
                </p>
                <p>
                  When the total bet amount of the round hits the target ({displayServiceFee} *
                  sales price of the punk), the punk is purchased and a winner is randomly picked to
                  claim the punk.
                </p>

                <h2>How much should I bet?</h2>
                <p>
                  Our algorithm guarantees the probability is proportional to the bet amount. The
                  more you bet, the more likely you will win.
                </p>
                <h2>How do I get refund?</h2>
                <p>
                  You can get a full refund anytime during the round. If the round is passed, you can also
                  claim the refund. You still need to pay all the gas fee involved.
                </p>
                <h2>How do you pick the winner?</h2>
                <p>
                  Our smart contract calls Chainlink VRF (Verifiable Random Function) when deciding
                  the winner. VRF is provably-fair and verifiable source of randomness.
                </p>
                <h2>Why is it dedicated to CryptoPunks?</h2>
                <p>
                  There are too many overvalued NFTs and large price fluctuations. CryptoPunks is
                  one of the most valuable NFTs and the price is relatively stable these days. Also,
                  isn’t it a cool thing to win a Punk?
                </p>
              </article>
            </section>
          </section>
        </main>
      </div>
    </>
  )
}

export default memo(Faq)
