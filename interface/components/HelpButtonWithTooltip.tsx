import { Popover, Transition } from '@headlessui/react'
import React, { Fragment, memo, ReactNode, useState } from 'react'
import { usePopper } from 'react-popper'
import HelpIcon from './Icons/HelpIcon'

const HelpIconWithTooltip = memo<{ content?: ReactNode }>((props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>()
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
  })

  return (
    <Popover className="relative w-[18px] h-[18px] ml-1">
      <Popover.Button ref={setReferenceElement}>
        <HelpIcon />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          className="z-10 min-w-[280px] px-4 ml-2"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="overflow-hidden text-bold">
            <div className="relative bg-white p-1">
              <div className="text-base text-black w-full">{props.content}</div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
})
export default HelpIconWithTooltip
