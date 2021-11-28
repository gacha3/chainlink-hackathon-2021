import { ethers } from 'ethers'
import pMap from 'p-map'
import React, { FC, memo, useCallback, useMemo } from 'react'

import useAsync from '../hooks/useAsync'
import usePunkGachaContract from '../hooks/usePunkGachaContract'
import useSigner from '../hooks/useSigner'
import HelpButtonWithTooltip from './HelpButtonWithTooltip'

interface Props {}

const MyBetHelpIcon: FC<Props> = () => {
  const punkgachaContract = usePunkGachaContract()
  const signer = useSigner()

  const signedPunkGachaContract = useMemo(() => {
    if (!signer) return
    return punkgachaContract.connect(signer)
  }, [punkgachaContract, signer])

  const handleRefund = useAsync(
    useCallback(async () => {
      if (!signer || !signedPunkGachaContract) return
      const chipsCount = await punkgachaContract.chipsCount()
      const chips = await pMap(
        Array.from({ length: chipsCount.toNumber() }),
        (_, index) => punkgachaContract.chips(ethers.BigNumber.from(index)),
        { concurrency: 1000 },
      )
      await signedPunkGachaContract.refund(
        chips.reduce((array, chip, index) => {
          if (chip.player === signer._address) array.push(ethers.BigNumber.from(index))
          return array
        }, [] as ethers.BigNumber[]),
      )
    }, [punkgachaContract, signedPunkGachaContract, signer]),
  )

  return (
    <HelpButtonWithTooltip
      content={
        <button
          className="w-full text-left font-base font-bold text-black px-5 py-3 hover:bg-black/30"
          onClick={handleRefund.execute}
        >
          {handleRefund.status === 'idle' && 'Refund'}
          {handleRefund.status === 'pending' && 'Pending...'}
          {handleRefund.status === 'success' && 'Refund Successed'}
          {handleRefund.status === 'error' && handleRefund.error?.message}
        </button>
      }
    />
  )
}

export default memo(MyBetHelpIcon)
