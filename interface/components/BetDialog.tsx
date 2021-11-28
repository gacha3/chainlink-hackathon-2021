import { Dialog, Transition } from '@headlessui/react'
import React, { FC, Fragment, memo, useCallback, useMemo, useState } from 'react'
import { useForm, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { ethers } from 'ethers'
import useAsync from '../hooks/useAsync'
import useSignedPunkGachaContract from '../hooks/useSignedPunkGachaContract'
import Button from './Button'
import BetIcon from './Icons/BetIcon'
import classNames from 'classnames'
import { DISCORD_URL, NEXT_PUBLIC_ETHERSCAN_PREFIX, TWITTER_URL } from '../utils/const'

interface BetDialogProps {
  show: boolean
  onRequestClose: () => void
}

const defaultEther = '0.05'

type InputValue = { value: string }

const BetDialog: FC<BetDialogProps> = (props) => {
  const { show, onRequestClose } = props
  const signedPunkGachaContract = useSignedPunkGachaContract()
  const [txnHash, setTxnHash] = useState('')
  const { register, handleSubmit, reset, setValue } = useForm<InputValue>({
    defaultValues: { value: defaultEther },
  })

  const handleBet = useAsync(
    useCallback(
      async (data: InputValue) => {
        if (!signedPunkGachaContract) return
        const { value } = data
        const contractTransaction = await signedPunkGachaContract.bet({
          value: ethers.utils.parseEther(value || defaultEther),
        })
        setTxnHash(contractTransaction.hash)
        reset()
      },
      [signedPunkGachaContract, reset],
    ),
  )

  const onClose = useCallback(() => {
    handleBet.reset()
    onRequestClose()
  }, [handleBet, onRequestClose])

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
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
            <div className="inline-block w-full max-w-md px-6 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white">
              {handleBet.status === 'success' ? (
                <SuccessScene txhHash={txnHash} />
              ) : (
                <BetScene
                  setValue={setValue}
                  handleSubmit={handleSubmit}
                  handleBet={handleBet}
                  register={register}
                />
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

interface BetSceneProps {
  setValue: UseFormSetValue<InputValue>
  handleSubmit: UseFormHandleSubmit<InputValue>
  register: UseFormRegister<InputValue>
  handleBet: any // FIXME
}

const BetScene = memo<BetSceneProps>((props) => {
  const { setValue, handleSubmit, register, handleBet } = props
  return (
    <>
      <Dialog.Title as="h3" className="text-2xl font-bold mb-2">
        Bet
      </Dialog.Title>
      <div className="flex space-x-3 md:space-x-8 py-2">
        {[1, 5, 20, 100, 1000, 10000].map((num) => (
          <div
            key={num}
            className="text-base md:text-lg hover:underline cursor-pointer"
            onClick={() => {
              setValue('value', (num / 100).toString())
            }}
          >
            {num}x
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(handleBet.execute)}>
        <div className="flex justify-end items-center space-x-8 mt-4 mb-2">
          <div className="flex-1 flex flex-col w-[120px]">
            <div className="flex-1 flex items-center justify-center text-black text-2xl py-1 font-bold">
              <input
                className="appearance-none min-w-0 text-right focus:outline-none font-bold"
                placeholder={defaultEther}
                inputMode="decimal"
                type="number"
                step="1e-18"
                min="0.01"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                {...register('value')}
              />
              <span>{ethers.constants.EtherSymbol}</span>
            </div>
            <div className="w-full h-[2px] bg-black"></div>
          </div>
          <Button
            type="submit"
            className="w-[144px] !text-2xl !py-1 !text-white !bg-black disabled:!bg-opacity-30 flex justify-evenly"
            disabled={handleBet.status === 'pending'}
          >
            <BetIcon fill="white" />
            {handleBet.status === 'pending' ? 'Pending..' : 'Bet'}
          </Button>
        </div>
        {handleBet.error && (
          <div className="mt-4 text-red-900">
            {(handleBet.error as any).reason
              ? `error: ${(handleBet.error as any).reason}`
              : handleBet.error.message}
          </div>
        )}
      </form>
    </>
  )
})
BetScene.displayName = 'BetPanel'

interface SuccessSceneProps {
  txhHash: string
}

const linkClassNames = 'w-full text-2xl py-1.5 px-4 text-base font-bold text-center'

const SuccessScene = memo<SuccessSceneProps>((props) => {
  const { txhHash } = props

  return (
    <>
      <Dialog.Title as="h3" className="text-2xl font-bold mb-2">
        🎉 Success
      </Dialog.Title>
      <div>
        Your bet has been placed successfully.
        <br />
        Track this transaction on &nbsp;
        <a
          href={`${NEXT_PUBLIC_ETHERSCAN_PREFIX}tx/${txhHash}`}
          target="_blank"
          rel="noreferrer"
          className="underline text-[#21325b]"
        >
          Etherscan
        </a>
        . <br />
        <br />
        Receive the result of this round by following us:
      </div>
      <div className="flex flex-row justify-center items-center space-x-4 mt-4">
        <a
          href={TWITTER_URL}
          className={classNames(linkClassNames, '!text-white !bg-[#1DA1F2]')}
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </a>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noreferrer"
          className={classNames(linkClassNames, '!text-white !bg-[#5865F2]')}
        >
          Discord
        </a>
      </div>
    </>
  )
})
SuccessScene.displayName = 'SuccessPanel'

export default memo(BetDialog)
