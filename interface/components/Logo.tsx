import React, { FC, memo } from 'react'
import GachainIcon from './Icons/GachainIcon'
import GIcon from './Icons/GIcon'

interface Props {}

const Logo: FC<Props> = () => {
  return (
    <div className="min-w-0 flex">
      <div className="hidden md:flex max-w-[150px]">
        <GachainIcon fill="white" />
      </div>
      <div className="flex md:hidden w-5 sm:w-10">
        <GIcon />
      </div>
    </div>
  )
}

export default memo(Logo)
