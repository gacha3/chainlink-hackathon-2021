import React, { FC, memo, useMemo } from 'react'
import { ethers } from 'ethers'
import { useQuery } from 'react-query'
import classNames from 'classnames'
import uniqBy from 'lodash/uniqBy'

import CryptoPunkImage from './CryptoPunkImage'
import usePunkGachaContract from '../hooks/usePunkGachaContract'
import { formatAddress } from '../utils/formatter'
import useRoundCloseEvent from '../hooks/query/useRoundCloseEvent'
import useCryptoPunksContract from '../hooks/useCryptoPunksContract'

interface Props {}

export type SimpleRoundEvent = { roundId: ethers.BigNumber; punkIndex: number; winner: string }

const RoundList: FC<Props> = () => {
  const { data: roundEvents, error, isLoading } = useRoundCloseEvent()

  const uniquedEvents = useMemo(() => {
    if (!roundEvents) return []
    return uniqBy(roundEvents, (event) => event.roundId.toString())
  }, [roundEvents])

  return (
    <div className="w-full text-white ">
      <div className="flex items-center justify-between border-b-[1px] border-secondary mt-20 mb-4 pb-[7px]">
        <h1 className="font-bold text-white text-2xl tracking-wide">Previous Rounds</h1>
        {/* <a className="text-lg cursor-pointer">View All</a> */}
      </div>
      <div className="flex flex-col space-y-4">
        {isLoading && <div className="flex items-center font-bold">Loading...</div>}
        {error && <div className="flex items-center font-bold">Error: {error}</div>}
        {uniquedEvents ? (
          uniquedEvents.length === 0 ? (
            <div className="flex items-center font-bold">No record so far.</div>
          ) : (
            uniquedEvents.map((roundEvent) => (
              <RoundListItem key={roundEvent.roundId.toString()} {...roundEvent} />
            ))
          )
        ) : null}
      </div>
    </div>
  )
}

interface RoundListItemProps {}

const RoundListItem = memo<RoundListItemProps & SimpleRoundEvent>((props) => {
  const { roundId, winner, punkIndex } = props
  const punkGachaContract = usePunkGachaContract()
  const { data: playerBetEvents } = useQuery(['PlayerBet', roundId.toNumber(), winner], () =>
    punkGachaContract.queryFilter(
      punkGachaContract.filters.PlayerBet(ethers.BigNumber.from(roundId), winner),
    ),
  )
  const playerBet = useMemo(
    () => playerBetEvents?.reduce((sum, event) => sum.add(event.args[2]), ethers.BigNumber.from(0)),
    [playerBetEvents],
  )
  const { data: roundCloseEvent } = useQuery(['RoundClose', roundId.toNumber(), winner], () =>
    punkGachaContract.queryFilter(
      punkGachaContract.filters.RoundClose(ethers.BigNumber.from(roundId), winner),
    ),
  )
  const { data: block } = useQuery(
    ['getBlock', roundCloseEvent?.[0].logIndex],
    () => roundCloseEvent?.[0].getBlock(),
    { enabled: !!roundCloseEvent },
  )
  const cryptoPunksContract = useCryptoPunksContract()
  const { data: punkColor = 'bg-cryptopunk-blue' } = useQuery(
    ['punkColor', punkIndex],
    async () => {
      const sale = await cryptoPunksContract.punksOfferedForSale(punkIndex)
      if (sale.isForSale) {
        return 'bg-cryptopunk-red'
      }
      const bid = await cryptoPunksContract.punkBids(punkIndex)
      if (bid) {
        return 'bg-cryptopunk-purple'
      }
      return 'bg-cryptopunk-blue'
    },
  )

  return (
    <div className="flex items-center flex-row flex-wrap text-lg" key={roundId.toString()}>
      <CryptoPunkImage
        id={punkIndex.toString()}
        className={classNames('w-6 h-6 mr-2', punkColor)}
        scale={1}
      />
      <span className="font-number font-bold">#{roundId.toString()}</span>:&nbsp;
      {ethers.BigNumber.from(winner).eq(ethers.BigNumber.from(0)) ? (
        <>
          <a
            className="font-bold underline"
            href={`https://www.larvalabs.com/cryptopunks/details/${punkIndex}`}
            target="_blank"
            rel="noreferrer"
          >
            CryptoPunk&nbsp;{punkIndex}
          </a>
          &nbsp;passed
        </>
      ) : (
        <>
          <a
            className="font-number underline font-bold"
            href={`https://www.larvalabs.com/cryptopunks/accountinfo?account=${winner}`}
            target="_blank"
            rel="noreferrer"
          >
            {formatAddress(winner)}
          </a>
          &nbsp;won the&nbsp;
          <a
            className="font-bold underline"
            href={`https://www.larvalabs.com/cryptopunks/details/${punkIndex}`}
            target="_blank"
            rel="noreferrer"
          >
            CryptoPunk&nbsp;{punkIndex}
          </a>
          &nbsp;with&nbsp;
          <span className="font-bold font-number">
            {playerBet ? `${ethers.utils.formatEther(playerBet)}Ξ` : '-'}
          </span>
        </>
      )}
      &nbsp;
      {block?.timestamp ? `at ${new Date(block.timestamp * 1000).toLocaleString()}` : ''}.
    </div>
  )
})

RoundListItem.displayName = 'RoundListItem'

export default memo(RoundList)
