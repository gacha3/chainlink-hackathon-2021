import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { ButtonHTMLAttributes, FC, Fragment, memo, useCallback, useMemo } from 'react'
import { useWallet } from 'use-wallet'

interface DialogProps {
  show: boolean
  onRequestClose: () => void
}
const ConnectWalletDialog: FC<DialogProps> = (props) => {
  const { show, onRequestClose } = props

  const wallet = useWallet()

  const connect = useCallback(
    async (connectorId: string) => {
      await wallet.connect(connectorId)
      onRequestClose()
    },
    [onRequestClose, wallet],
  )

  const connectInjected = useCallback(() => {
    connect('injected')
  }, [connect])

  const connectWalletConnect = useCallback(() => {
    connect('walletconnect')
  }, [connect])

  return (
    <Transition appear show={show} as={Fragment}>
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
            <div className="inline-block w-full max-w-md px-6 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
              <Dialog.Title as="h3" className="text-2xl font-bold mb-4">
                Connect to your wallet
              </Dialog.Title>
              <div className="mt-2">
                <p className="">Choose your wallet provider to connect to your wallet.</p>
              </div>

              <div className="flex flex-col mt-4 space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <WalletButton
                  color="red"
                  onClick={connectInjected}
                  disabled={wallet.status === 'connecting'}
                >
                  MetaMask
                </WalletButton>
                <WalletButton
                  color="blue"
                  onClick={connectWalletConnect}
                  disabled={wallet.status === 'connecting'}
                >
                  WalletConnect
                </WalletButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

interface WalletButtonProps {
  color: string
}
const WalletButton = memo<WalletButtonProps & ButtonHTMLAttributes<HTMLButtonElement>>((props) => {
  const { color, className } = props
  const colorClass = useMemo(() => {
    // dosn't support syntax like `bg-${color}`, becasue destination class (eg: bg-red-500) will be purge from final css file.
    switch (color) {
      case 'red':
        return `bg-[#fce0c0] text-[#D87C30] `
      case 'blue':
        return `bg-[#D9ECFF] text-[#278FFC] `
      default:
        return ''
    }
  }, [color])
  return (
    <button
      type="button"
      {...props}
      className={classNames(
        className,
        colorClass,
        'inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50',
      )}
    />
  )
})
WalletButton.displayName = 'WalletButton'
export default memo(ConnectWalletDialog)
