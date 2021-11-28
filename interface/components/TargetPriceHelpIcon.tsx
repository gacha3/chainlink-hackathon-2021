import { ethers } from 'ethers'
import React, { FC, memo } from 'react'
import { Round } from '../utils/types'
import HelpButtonWithTooltip from './HelpButtonWithTooltip'

interface Props {
  round?: Round
  serviceFeeThousandth?: ethers.BigNumber
}

const TargetPriceHelpIcon: FC<Props> = (props) => {
  const { round, serviceFeeThousandth } = props
  const minValue = round?.[0]
  return (
    <HelpButtonWithTooltip
      content={
        <div className="px-5 py-3">
          Original price: {minValue ? ethers.utils.formatEther(minValue) : '-'}Ξ
          <br />
          Service fee:&nbsp;
          {minValue && serviceFeeThousandth
            ? ethers.utils.formatEther(minValue.mul(serviceFeeThousandth?.toNumber()).div(1000))
            : '-'}
          Ξ
        </div>
      }
    />
  )
}

export default memo(TargetPriceHelpIcon)
