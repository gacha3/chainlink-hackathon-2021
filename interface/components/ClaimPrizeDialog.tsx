import { Dialog, Transition } from '@headlessui/react'

import { ethers } from 'ethers'
import React, { FC, Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from 'use-wallet'
import { RoundCloseEvent } from '../abi/PunkGacha'
import useAsync from '../hooks/useAsync'
import useCryptoPunksContract from '../hooks/useCryptoPunksContract'
import usePunkGachaContract from '../hooks/usePunkGachaContract'
import useSigner from '../hooks/useSigner'
import { PUNKGACHA_ADDRESS } from '../utils/const'
import CryptoPunkImage from './CryptoPunkImage'
import { SimpleRoundEvent } from './RoundList'

interface DialogProps {}

const ClaimPrizeDialog: FC<DialogProps> = (props) => {
  const cryptoPunksContract = useCryptoPunksContract()
  const signer = useSigner()
  const wallet = useWallet()
  const [show, setShow] = useState(true)
  const [winningEvents, setWinningEvents] = useState<SimpleRoundEvent[]>([])
  const [eventIndex, setEventIndex] = useState(0)

  const punkGachaContract = usePunkGachaContract()

  const roundCloseFilter = useMemo(() => {
    if (!wallet.account) return
    return punkGachaContract.filters.RoundClose(null, wallet.account)
  }, [punkGachaContract.filters, wallet.account])

  const filterClaimableRound = useCallback(
    async (events: RoundCloseEvent[]) => {
      const hasCalimed = await Promise.all(
        events.map(({ args: { punkIndex } }) =>
          cryptoPunksContract
            .punkIndexToAddress(ethers.BigNumber.from(punkIndex))
            .then((address) => address !== PUNKGACHA_ADDRESS),
        ),
      )

      return events
        .filter((_, i) => !hasCalimed[i])
        .map(
          ({ args: { roundId, punkIndex, winner } }) =>
            ({ roundId, punkIndex, winner } as SimpleRoundEvent),
        )
    },
    [cryptoPunksContract],
  )

  const checkHistoryRoundCloseEvent = useCallback(async () => {
    if (!roundCloseFilter) return
    const events = await punkGachaContract.queryFilter(roundCloseFilter)
    setWinningEvents(await filterClaimableRound(events))
  }, [filterClaimableRound, punkGachaContract, roundCloseFilter])

  const onRequestClose = useCallback(() => {
    setShow(false)
  }, [])

  const currentEvent: SimpleRoundEvent | undefined = useMemo(
    () => winningEvents?.[eventIndex],
    [eventIndex, winningEvents],
  )

  const buyPunk = useAsync(
    useCallback(async () => {
      if (!signer || !currentEvent) return
      const signedContract = cryptoPunksContract.connect(signer)
      await signedContract.buyPunk(ethers.BigNumber.from(currentEvent.punkIndex))
      setWinningEvents((events) => {
        const [_, ...rest] = events
        return rest
      })
    }, [cryptoPunksContract, currentEvent, signer]),
  )

  useEffect(() => {
    checkHistoryRoundCloseEvent()
  }, [checkHistoryRoundCloseEvent])

  useEffect(() => {
    if (!roundCloseFilter) return
    const onRoundClose = (...data: [ethers.BigNumber, string, number, RoundCloseEvent]) => {
      const [roundId, winner, punkIndex] = data
      // has no nessesary to check claimable, cause it's fresh event
      setWinningEvents((events) => [...events, { roundId, winner, punkIndex }])
    }

    punkGachaContract.on(roundCloseFilter, onRoundClose)
    return () => {
      punkGachaContract.off(roundCloseFilter, onRoundClose)
    }
  }, [roundCloseFilter, punkGachaContract])

  return (
    <Transition appear show={show && !!currentEvent} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onRequestClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-flex flex-col items-center w-full max-w-md px-6 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white space-y-4">
              <Dialog.Title as="h3" className="text-2xl font-bold">
                Congratulations! 🎉
              </Dialog.Title>
              <div className="flex justify-center items-center bg-cryptopunk-red w-48 h-48 ">
                {currentEvent?.punkIndex && (
                  <CryptoPunkImage
                    id={currentEvent?.punkIndex.toString()}
                    className="inline-block w-6 h-6"
                    scale={8}
                  />
                )}
              </div>
              <p className="inline">
                You&apos;ve won the&nbsp;
                <a
                  className="font-bold underline focus:outline-none"
                  href={`https://www.larvalabs.com/cryptopunks/details/${currentEvent?.punkIndex}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  CryptoPunk&nbsp;{currentEvent?.punkIndex}
                </a>
                &nbsp;in&nbsp;round&nbsp;
                <span className="font-bold">#{currentEvent?.roundId.toString()}</span>!
              </p>
              <div className="flex flex-col mt-4 space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <button
                  disabled={buyPunk.status === 'pending'}
                  onClick={buyPunk.execute}
                  className="w-[144px] font-bold !text-2xl !py-1 !text-white !bg-black disabled:!bg-opacity-30"
                >
                  {buyPunk.status === 'idle' && <span>Claim</span>}
                  {buyPunk.status === 'pending' && <span>Pending...</span>}
                  {buyPunk.status === 'error' && <span>Failed</span>}
                  {buyPunk.status === 'success' && <span>Succeeded</span>}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default memo(ClaimPrizeDialog)
