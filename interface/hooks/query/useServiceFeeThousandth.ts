import { useCallback } from 'react'

import usePunkGachaContract from '../usePunkGachaContract'
import { useQuery } from 'react-query'

function useServiceFeeThousandth() {
  const punkGachaContract = usePunkGachaContract()

  const fetchPunkGachaServiceFeeThousandth = useCallback(
    async () => await punkGachaContract.serviceFeeThousandth(),
    [punkGachaContract],
  )

  return useQuery('serviceFeeThousandth', fetchPunkGachaServiceFeeThousandth)
}

export default useServiceFeeThousandth
