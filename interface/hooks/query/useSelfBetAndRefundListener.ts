import { ethers } from 'ethers'
import pMap from 'p-map'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from 'use-wallet'
import { PlayerBetEvent } from '../../abi/PunkGacha'
import { Round } from '../../utils/types'
import usePunkGachaContract from '../usePunkGachaContract'

export default function useSelfBetAndRefundListener(round?: Round) {
  const id = round?.[1] ?? undefined
  const [myBet, setMyBet] = useState(ethers.BigNumber.from(0))
  const wallet = useWallet()
  const punkGachaContract = usePunkGachaContract()

  const betFilter = useMemo(() => {
    if (!wallet.account || !id) return
    return punkGachaContract.filters.PlayerBet(ethers.BigNumber.from(id), wallet.account)
  }, [punkGachaContract.filters, id, wallet.account])

  const betListener = useCallback(
    (...data: [ethers.BigNumber, string, ethers.BigNumber, PlayerBetEvent]) => {
      const amount = data[2]
      setMyBet((b) => b.add(amount))
    },
    [],
  )

  const refundFilter = useMemo(() => {
    if (!wallet.account || !id) return
    return punkGachaContract.filters.PlayerRefund(ethers.BigNumber.from(id), wallet.account)
  }, [punkGachaContract.filters, id, wallet.account])

  const refundListener = useCallback(
    (...data: [ethers.BigNumber, string, ethers.BigNumber, PlayerBetEvent]) => {
      const amount = data[2]
      setMyBet((b) => b.sub(amount))
    },
    [],
  )

  const fetchBet = useCallback(async () => {
    if (!wallet.account) return
    const chipsCount = await punkGachaContract.chipsCount()
    const chips = await pMap(
      Array.from({ length: chipsCount.toNumber() }),
      (_, index) => punkGachaContract.chips(ethers.BigNumber.from(index)),
      { concurrency: 1000 },
    )

    const bet = chips
      .filter((chip) => chip[0] === wallet.account)
      .reduce((sum, chip) => sum.add(chip.amount), ethers.BigNumber.from(0))

    setMyBet(bet)
  }, [punkGachaContract, wallet.account])

  useEffect(() => {
    fetchBet()
  }, [fetchBet])

  useEffect(() => {
    if (!betFilter || !refundFilter) return

    punkGachaContract.on(betFilter, betListener)
    punkGachaContract.on(refundFilter, refundListener)
    return () => {
      punkGachaContract.off(betFilter, betListener)
      punkGachaContract.on(refundFilter, refundListener)
    }
  }, [punkGachaContract, betFilter, refundFilter, betListener, refundListener])

  return myBet
}
