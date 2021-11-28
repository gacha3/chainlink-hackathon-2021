import { ethers } from 'ethers'
import { FC, HTMLAttributes, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { format } from 'timeago.js'
import classNames from 'classnames'

import { PlayerBetEvent } from '../abi/PunkGacha'
import useRound from '../hooks/query/useRound'
import usePunkGachaContract from '../hooks/usePunkGachaContract'
import { formatAddress } from '../utils/formatter'
import styles from '../styles/marquee.module.css'
import usePlayerBetEvent from '../hooks/query/usePlayerBetEvent'

interface Props {}

type SimplePlayerBetEvent = {
  roundId: ethers.BigNumber
  player: string
  amount: ethers.BigNumber
}

const CurrentRoundMarquee: FC<Props> = () => {
  const round = useRound()
  const [eventLogIndex, setEventLogIndex] = useState(0)
  const { data: playerBetEvents, error, isLoading } = usePlayerBetEvent(round.data)

  const onAnimationIteration = useCallback(() => {
    if (!playerBetEvents || playerBetEvents.length === 0) return
    setEventLogIndex((i) => (i + 1) % playerBetEvents.length)
  }, [playerBetEvents])

  const nextIndex = useMemo(() => {
    if (!playerBetEvents || playerBetEvents.length === 0) return 0
    return (eventLogIndex + 1) % playerBetEvents.length
  }, [eventLogIndex, playerBetEvents])

  return (
    <div className="flex flex-1 w-full items-center text-lg">
      {isLoading && null}
      {error && <span>Error</span>}
      {playerBetEvents && playerBetEvents.length === 0 && null}
      {playerBetEvents && playerBetEvents.length > 0 && (
        <div className="flex flex-col w-full h-7 overflow-hidden relative">
          <RoundListItem {...playerBetEvents[eventLogIndex]} />
          <RoundListItem
            className="translate-y-7"
            {...playerBetEvents[nextIndex]}
            onAnimationIteration={onAnimationIteration}
          />
        </div>
      )}
    </div>
  )
}

export default memo(CurrentRoundMarquee)

interface RoundListItemProps {}

const RoundListItem = memo<
  HTMLAttributes<HTMLDivElement> & RoundListItemProps & SimplePlayerBetEvent
>((props) => {
  const { className, player, roundId, amount, onAnimationIteration } = props
  const punkGachaContract = usePunkGachaContract()
  const { data: playerBetEvents } = useQuery(['PlayerBet', roundId, player], () =>
    punkGachaContract.queryFilter(
      punkGachaContract.filters.PlayerBet(ethers.BigNumber.from(roundId), player),
    ),
  )
  const playerBetEvent = useMemo(
    () => playerBetEvents?.find((event) => event.args[2].eq(amount)),
    [amount, playerBetEvents],
  )
  const { data: block } = useQuery(
    ['getBlock', playerBetEvent?.logIndex],
    () => playerBetEvent?.getBlock(),
    { enabled: !!playerBetEvent },
  )

  return (
    <div
      className={classNames('flex h-7 items-center w-full truncate', styles.item, className)}
      onAnimationIteration={onAnimationIteration}
    >
      Player&nbsp;<span className="font-bold">{formatAddress(player)}</span>
      &nbsp;betted&nbsp;
      <span className="font-bold">
        {ethers.utils.formatEther(amount)}
        {ethers.constants.EtherSymbol}
      </span>
      <span className="truncate">&nbsp;{block ? format(block.timestamp * 1000) : ''}</span>.
    </div>
  )
})
RoundListItem.displayName = 'RoundListItem'
