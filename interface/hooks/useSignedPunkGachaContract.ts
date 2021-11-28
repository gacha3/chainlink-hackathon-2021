import { useMemo } from 'react'
import { PunkGacha__factory } from '../abi'
import { PUNKGACHA_ADDRESS } from '../utils/const'
import useSigner from './useSigner'

export default function useSignedPunkGachaContract() {
  const signer = useSigner()

  const PunkGachaContract = useMemo(() => {
    if (!signer) return
    return PunkGacha__factory.connect(PUNKGACHA_ADDRESS, signer)
  }, [signer])

  return PunkGachaContract
}
