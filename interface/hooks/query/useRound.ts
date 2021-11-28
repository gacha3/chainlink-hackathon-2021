import { useCallback } from 'react'
import { Round, RoundStatus } from '../../utils/types'
import usePunkGachaContract from '../usePunkGachaContract'
import { useQuery } from 'react-query'

function useRound() {
  const punkGachaContract = usePunkGachaContract()

  const fetchPunkGachaRound = useCallback(async () => {
    const round = (await punkGachaContract.currentRound()) as Round
    const status = round[3] as RoundStatus
    if (status === RoundStatus.CLOSE) {
      return undefined
    }
    return round
  }, [punkGachaContract])

  return useQuery('round', fetchPunkGachaRound)
}

export default useRound
