import { useContext } from 'react'
import { PunkGachaContractContext } from '../contexts/PunkGachaContract'

export default function usePunkGachaContract() {
  return useContext(PunkGachaContractContext)
}
