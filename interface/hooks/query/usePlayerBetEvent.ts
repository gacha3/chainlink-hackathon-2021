import { ethers } from 'ethers'
import { useCallback, useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { PlayerBetEvent } from '../../abi/PunkGacha'
import { Round } from '../../utils/types'
import usePunkGachaContract from '../usePunkGachaContract'
import useQueryFilterAndListener from './useQueryFilterAndListener'

const QUERY_KEY = 'currentRoundBet'

export type SimplePlayerBetEvent = {
  roundId: ethers.BigNumber
  player: string
  amount: ethers.BigNumber
}

export default function usePlayerBetEvent(round?: Round) {
  const id = round?.[1] ?? undefined
  const punkGachaContract = usePunkGachaContract()
  const queryClient = useQueryClient()

  const filter = useMemo(() => {
    if (!id) return
    return punkGachaContract.filters.PlayerBet(ethers.BigNumber.from(id))
  }, [punkGachaContract.filters, id])

  const eventModifier = useCallback((events: PlayerBetEvent[]) => {
    return events.slice(-10).map((event) => {
      const [roundId, player, amount] = event.args
      return { roundId, player, amount } as SimplePlayerBetEvent
    })
  }, [])

  const listener = useCallback(
    (...data: [ethers.BigNumber, string, ethers.BigNumber, PlayerBetEvent]) => {
      const [roundId, player, amount] = data
      queryClient.setQueryData<SimplePlayerBetEvent[]>(QUERY_KEY, (prev = []) => {
        const [_, ...rest] = prev
        return [...rest, { roundId, player, amount }]
      })
    },
    [queryClient],
  )

  const query = useQueryFilterAndListener({
    key: QUERY_KEY,
    filter,
    listener,
    eventModifier,
    punkGachaContract,
  })

  return query
}
