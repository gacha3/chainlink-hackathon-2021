import { ethers } from 'ethers'
import { useCallback, useEffect, useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { PlayerBetEvent, PlayerRefundEvent } from '../../abi/PunkGacha'
import { Round } from '../../utils/types'
import usePunkGachaContract from '../usePunkGachaContract'
import { CHIPS_COUNT_QUERY_KEY } from './useChipsCount'
import { TOTAL_AMOUNT_QUERY_KEY } from './useTotalAmount'

export default function useCurrentRoundInfoListener(round?: Round) {
  const id = round?.[1] ?? undefined
  const punkGachaContract = usePunkGachaContract()
  const queryClient = useQueryClient()

  const betFilter = useMemo(() => {
    if (!id) return
    return punkGachaContract.filters.PlayerBet(ethers.BigNumber.from(id))
  }, [punkGachaContract.filters, id])

  const refundFilter = useMemo(() => {
    if (!id) return
    return punkGachaContract.filters.PlayerRefund(ethers.BigNumber.from(id))
  }, [punkGachaContract.filters, id])

  const betListener = useCallback(
    (...data: [ethers.BigNumber, string, ethers.BigNumber, PlayerBetEvent]) => {
      const [_, __, amount] = data
      queryClient.setQueryData<ethers.BigNumber>(
        TOTAL_AMOUNT_QUERY_KEY,
        (prev = ethers.BigNumber.from(0)) => prev.add(amount),
      )
      queryClient.setQueryData<ethers.BigNumber>(
        CHIPS_COUNT_QUERY_KEY,
        (prev = ethers.BigNumber.from(0)) => prev.add(1),
      )
    },
    [queryClient],
  )

  const refundListener = useCallback(
    (...data: [ethers.BigNumber, string, ethers.BigNumber, PlayerRefundEvent]) => {
      const [_, __, amount] = data
      queryClient.setQueryData<ethers.BigNumber>(
        TOTAL_AMOUNT_QUERY_KEY,
        (prev = ethers.BigNumber.from(0)) => prev.sub(amount),
      )
    },
    [queryClient],
  )

  useEffect(() => {
    if (!betFilter || !refundFilter) return

    punkGachaContract.on(betFilter, betListener)
    punkGachaContract.on(refundFilter, refundListener)
    return () => {
      punkGachaContract.off(betFilter, betListener)
      punkGachaContract.off(refundFilter, refundListener)
    }
  }, [betFilter, refundFilter, punkGachaContract, betListener, refundListener])
}
