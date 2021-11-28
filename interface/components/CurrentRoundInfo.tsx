import { ethers } from 'ethers'
import clamp from 'lodash/clamp'
import React, { CSSProperties, FC, memo, ReactNode, useEffect, useMemo, useState } from 'react'

import useChipsCount from '../hooks/query/useChipsCount'
import useCurrentRoundInfoListener from '../hooks/query/useCurrentRoundInfoListener'
import useRound from '../hooks/query/useRound'
import useSelfBetAndRefundListener from '../hooks/query/useSelfBetAndRefundListener'
import useServiceFeeThousandth from '../hooks/query/useServiceFeeThousandth'
import useTotalAmount from '../hooks/query/useTotalAmount'
import CryptoPunkImage from './CryptoPunkImage'
import OpenInNewIcon from './Icons/OpenInNewIcon'
import MyBetHelpIcon from './MyBetHelpIcon'
import TargetPriceHelpIcon from './TargetPriceHelpIcon'

interface Props {}

const CurrentRoundInfo: FC<Props> = () => {
  const { isLoading, data: round } = useRound()
  const { data: totalAmount } = useTotalAmount()
  const { data: serviceFeeThousandth } = useServiceFeeThousandth()
  const { data: chipsCount } = useChipsCount()

  const punkIndexString = useMemo(() => round?.[2].toString() ?? '?', [round])

  const targetValue = useMemo(() => {
    if (!serviceFeeThousandth || !round) return
    const minValue = round[0]
    return minValue.add(minValue.mul(serviceFeeThousandth).div(1000))
  }, [round, serviceFeeThousandth])

  const progress = useMemo(() => {
    if (!targetValue || !totalAmount) return 0
    if (targetValue.eq(ethers.BigNumber.from(0))) return 0
    const currentNumber = totalAmount.mul(100).div(targetValue).toNumber()
    return clamp(currentNumber, 0, 100)
  }, [totalAmount, targetValue])

  const style: CSSProperties = useMemo(() => ({ width: `${progress}%` }), [progress])

  useCurrentRoundInfoListener(round)
  const myBet = useSelfBetAndRefundListener(round)

  const [randomPunkIndex, setRandomPunkIndex] = useState<number>()
  useEffect(() => {
    const handle = setInterval(() => {
      setRandomPunkIndex(Math.floor(Math.random() * 10000))
    }, 100)
    return () => clearInterval(handle)
  }, [])

  return (
    <div className="flex flex-col text-white font-bold">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full md:flex justify-between items-center text-2xl md:text-4xl">
          <span>{round ? `Round #${round[1].toString()}` : 'Waiting for next round'}</span>
          <div className="flex items-start">
            {round && (
              <>
                <span>CryptoPunk {punkIndexString}</span>
                <a
                  className="flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-black  focus-visible:ring-white ml-1 md:mr-[-24px]"
                  href={`https://www.larvalabs.com/cryptopunks/details/${punkIndexString}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <OpenInNewIcon />
                </a>
              </>
            )}
          </div>
        </div>

        <div className="w-full h-60 flex justify-center items-center bg-cryptopunk-red flex-shrink-0">
          {isLoading ? (
            <div>loading...</div>
          ) : round ? (
            <CryptoPunkImage id={round[2].toString()} scale={10} className="w-6 h-6" />
          ) : (
            <CryptoPunkImage
              id={randomPunkIndex?.toString() || '0'}
              scale={10}
              className="w-6 h-6"
            />
          )}
        </div>

        {round && (
          <>
            <div className="relative flex w-full border-[3px] bg-black border-white h-10 overflow-hidden">
              <div className="absolute left-0 bg-white h-full" style={style} />
              <span className="mix-blend-difference text-white font-number text-center m-auto">
                {progress}%
              </span>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 place-items-center">
              <ProgressItem
                title="TAREGT"
                titleChildNode={
                  <TargetPriceHelpIcon round={round} serviceFeeThousandth={serviceFeeThousandth} />
                }
                value={`${
                  targetValue
                    ? `${ethers.utils.formatEther(targetValue)}${ethers.constants.EtherSymbol}`
                    : '-'
                }`}
              />
              <ProgressItem
                title="CURRENT"
                value={`${
                  totalAmount === undefined
                    ? '-'
                    : `${ethers.utils.formatEther(totalAmount)}${ethers.constants.EtherSymbol}`
                }`}
              />
              <ProgressItem
                title="PLAYERS"
                value={chipsCount === undefined ? '-' : chipsCount?.toString()}
              />
              <ProgressItem
                title="MY BET"
                value={
                  myBet ? `${ethers.utils.formatEther(myBet)}${ethers.constants.EtherSymbol}` : '-'
                }
                titleChildNode={<MyBetHelpIcon />}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface ProgressItemProps {
  title: string
  value?: string
  titleChildNode?: ReactNode
  childNode?: ReactNode
}
const ProgressItem = memo<ProgressItemProps>((props) => {
  const { title, value, titleChildNode, childNode } = props
  return (
    <div className="flex flex-col items-center select-none">
      <div className="div flex items-center text-secondary text-xs md:text-sm">
        <span>{title}</span>
        {titleChildNode}
      </div>
      {childNode ? childNode : <span className="font-number text-base md:text-lg">{value}</span>}
    </div>
  )
})
ProgressItem.displayName = 'Item'

export default memo(CurrentRoundInfo)
