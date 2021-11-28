import React, { ButtonHTMLAttributes, FC, Fragment, memo, useCallback } from 'react'
import { useWallet } from 'use-wallet'
import classNames from 'classnames'
import { Menu, Transition } from '@headlessui/react'

import { formatAddress } from '../utils/formatter'

interface Props {}

const className =
  'text-white py-1.5 px-2 md:px-4 md:py-3.5 flex-shrink-0 text-sm md:text-lg font-bold hover:underline'

const ConnectWalletButton: FC<Props> = () => {
  const wallet = useWallet()

  const disconnect = useCallback(() => {
    wallet.reset()
  }, [wallet])

  return (
    <>
      {wallet.status === 'connected' ? (
        <AddressMenu onDisconnect={disconnect} address={wallet.account} />
      ) : null}
    </>
  )
}

export default memo(ConnectWalletButton)

interface WalletStateMenuProps {
  address: string | null
  onDisconnect: () => void
}
const AddressMenu = memo<WalletStateMenuProps>((props) => {
  const { address, onDisconnect } = props
  return (
    <Menu as="div" className={classNames(className, 'relative block font-inter')}>
      <Menu.Button as="span" className="cursor-pointer hover:underline">
        {formatAddress(address)}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white focus:outline-none">
          <div className="px-1 py-1">
            <MenuItem onClick={onDisconnect}>Disconnect</MenuItem>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
})
AddressMenu.displayName = 'WalletStateMenu'

const MenuItem = memo((props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          {...props}
          className={classNames(
            'group flex items-center w-full px-2 py-2 text-base font-bold text-black',
            active ? 'bg-black/30' : '',
            props.className,
          )}
        />
      )}
    </Menu.Item>
  )
})
MenuItem.displayName = 'MenuItem'
