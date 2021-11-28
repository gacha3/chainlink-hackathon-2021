import { useCallback } from 'react'

import usePunkGachaContract from '../usePunkGachaContract'
import { useQuery } from 'react-query'

export const TOTAL_AMOUNT_QUERY_KEY = 'stackedAmount'
function useTotalAmount() {
  const punkGachaContract = usePunkGachaContract()

  const fetchPunkGachaTotalAmount = useCallback(
    async () => await punkGachaContract.totalAmount(),
    [punkGachaContract],
  )

  return useQuery(TOTAL_AMOUNT_QUERY_KEY, fetchPunkGachaTotalAmount)
}

export default useTotalAmount
