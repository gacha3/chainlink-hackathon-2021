import React, { FC, memo, useCallback, useMemo, useState } from 'react'
import { useWallet } from 'use-wallet'

import ConnectWalletDialog from './ConnectWalletDialog'
import Button from './Button'
import { RoundStatus } from '../utils/types'
import useRound from '../hooks/query/useRound'
import BetDialog from './BetDialog'
import CurrentRoundMarquee from './CurrentRoundMarquee'
import BetIcon from './Icons/BetIcon'
import { ethers } from 'ethers'
import { CHAIN_ID } from '../utils/const'

interface Props {}

const Panel: FC<Props> = () => {
  const wallet = useWallet()
  const { data: round, isLoading } = useRound()
  const [showConnectWalletDialog, setShowConnectWalletDialog] = useState(false)
  const [showBetDialog, setShowBetDialog] = useState(false)

  const roundStatus = useMemo(() => {
    if (!round) return
    return round[3] as RoundStatus
  }, [round])

  const openBetDialog = useCallback(() => {
    setShowBetDialog(true)
  }, [])

  const closeBetDialog = useCallback(() => {
    setShowBetDialog(false)
  }, [])

  const openConnectWalletDialog = useCallback(() => {
    setShowConnectWalletDialog(true)
  }, [])

  const closeConnectWalletDialog = useCallback(() => {
    setShowConnectWalletDialog(false)
  }, [])

  const needSwitchNetwork = useMemo(() => wallet.chainId !== CHAIN_ID, [wallet.chainId])

  const switchNetwork = useCallback(async () => {
    const ethereum = wallet.ethereum
    if (!ethereum) return
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ethers.utils.hexValue(CHAIN_ID) }],
    })
  }, [wallet])

  return (
    <div className="flex flex-col md:flex-row items-center text-white space-y-4 md:space-y-0">
      <CurrentRoundMarquee />
      <div className="flex justify-end">
        {wallet.status === 'connected' ? (
          needSwitchNetwork ? (
            <Button
              type="submit"
              className="min-w-[144px] !text-2xl !py-1 flex justify-evenly"
              onClick={switchNetwork}
            >
              Switch Network
            </Button>
          ) : (
            round && (
              <Button
                type="submit"
                className="min-w-[144px] !text-2xl !py-1 flex justify-evenly"
                disabled={roundStatus !== RoundStatus.OPEN}
                onClick={openBetDialog}
              >
                {roundStatus === RoundStatus.OPEN ? (
                  <>
                    <BetIcon />
                    Bet
                  </>
                ) : roundStatus === RoundStatus.CLOSE ? (
                  'Waiting for Next Round'
                ) : roundStatus === RoundStatus.DRAW ? (
                  'Drawing...'
                ) : (
                  ''
                )}
              </Button>
            )
          )
        ) : (
          !isLoading && (
            <Button
              className="min-w-[144px] !text-2xl !py-1 flex justify-evenly"
              onClick={openConnectWalletDialog}
            >
              Connect Wallet
            </Button>
          )
        )}
      </div>
      <ConnectWalletDialog
        show={showConnectWalletDialog}
        onRequestClose={closeConnectWalletDialog}
      />
      <BetDialog show={showBetDialog} onRequestClose={closeBetDialog} />
    </div>
  )
}

export default memo(Panel)
