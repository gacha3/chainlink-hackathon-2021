import { useContext } from 'react'
import { CryptoPunksContractContext } from '../contexts/CryptoPunksContract'

export default function useCryptoPunksContract() {
  return useContext(CryptoPunksContractContext)
}
