import React, { FC, memo } from 'react'
import Link from 'next/link'

import { DISCORD_URL, TWITTER_URL } from '../utils/const'
import Discord from './Icons/Discord'
import Twitter from './Icons/Twitter'
import WalletState from './WalletState'
import Logo from './Logo'

interface Props {
  displayWalletState?: boolean
  displayFAQ?: boolean
  displayApp?: boolean
}

const className =
  'text-white py-1.5 px-2 md:px-4 md:py-3.5 flex-shrink-0 text-sm md:text-lg font-bold hover:underline'

const Navbar: FC<Props> = (props) => {
  const { displayWalletState = false, displayApp = false, displayFAQ = false } = props
  return (
    <nav className="sticky top-0 z-30 bg-opacity-70 bg-black backdrop-blur-md select-none">
      <div className="max-w-8xl mx-auto xl:px-8">
        <div className="flex items-center justify-between px-4 py-5 lg:px-8 sm:px-6 xl:px-0 space-x-1 md:h-24">
          <a href="https://gacha.in" target="_blank" rel="noreferrer">
            <Logo />
          </a>
          <div className="flex items-center space-x-2">
            {displayWalletState && <WalletState />}
            {displayFAQ && (
              <Link href="/faq" passHref>
                <a className={className}>FAQ</a>
              </Link>
            )}
            {displayApp && (
              <Link href="/" passHref>
                <a className={className}>APP</a>
              </Link>
            )}
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className={className}>
              <Discord />
            </a>
            <a href={TWITTER_URL} target="_blank" rel="noreferrer" className={className}>
              <Twitter />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default memo(Navbar)
