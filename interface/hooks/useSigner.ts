import { ethers } from 'ethers'
import { useMemo } from 'react'
import { useWallet } from 'use-wallet'
import { CHAIN_ID } from '../utils/const'

export default function useSigner() {
  const wallet = useWallet()
  const signer = useMemo(
    () =>
      wallet.ethereum && wallet.account
        ? new ethers.providers.Web3Provider(wallet.ethereum, CHAIN_ID).getSigner(wallet.account)
        : undefined,
    [wallet],
  )

  return signer
}
