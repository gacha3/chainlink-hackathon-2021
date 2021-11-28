import { useCallback } from 'react'
import { useQuery } from 'react-query'
import usePunkGachaContract from '../usePunkGachaContract'

export const CHIPS_COUNT_QUERY_KEY = 'chipsCount'

export default function useChipsCount() {
  const punkGachaContract = usePunkGachaContract()

  const fetchPunkGachaChipsCount = useCallback(
    async () => await punkGachaContract.chipsCount(),
    [punkGachaContract],
  )

  return useQuery(CHIPS_COUNT_QUERY_KEY, fetchPunkGachaChipsCount)
}
