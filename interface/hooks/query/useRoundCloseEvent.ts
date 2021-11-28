import { ethers } from 'ethers'
import { useCallback, useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { RoundCloseEvent } from '../../abi/PunkGacha'
import usePunkGachaContract from '../usePunkGachaContract'
import useQueryFilterAndListener from './useQueryFilterAndListener'

type SimpleRoundEvent = { roundId: ethers.BigNumber; punkIndex: number; winner: string }

const QUERY_KEY = 'RoundCloseEvent'

export default function useRoundCloseEvent() {
  const punkGachaContract = usePunkGachaContract()
  const queryClient = useQueryClient()

  const filter = useMemo(() => punkGachaContract.filters.RoundClose(), [punkGachaContract.filters])

  const listener = useCallback(
    (...data: [ethers.BigNumber, string, number, RoundCloseEvent]) => {
      const [roundId, winner, punkIndex] = data
      queryClient.setQueryData<SimpleRoundEvent[]>(QUERY_KEY, (prev = []) => [
        { roundId, winner, punkIndex },
        ...prev,
      ])
    },
    [queryClient],
  )

  const eventModifier = useCallback((events: RoundCloseEvent[]) => {
    return events
      .map((log) => {
        const [roundId, winner, punkIndex] = log.args
        return { roundId, winner, punkIndex } as SimpleRoundEvent
      })
      .reverse()
  }, [])

  const query = useQueryFilterAndListener({
    key: QUERY_KEY,
    filter,
    listener,
    eventModifier,
    punkGachaContract,
  })

  return query
}
