import { FC, memo } from 'react'
import { CHAINLINK_URL } from '../utils/const'
import Chainlink from './Icons/Chainlink'

interface Props {}

const Footer: FC<Props> = () => {
  return (
    <div className="w-full text-white">
      <div className="flex justify-center mt-[130px] mr-[24px]">
        <a href={CHAINLINK_URL} target="_blank" rel="noreferrer">
          <Chainlink />
        </a>
      </div>
    </div>
  )
}

export default memo(Footer)
