import { FC, memo } from 'react'

interface Props {}

const GIcon: FC<Props> = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3H37V37H3V3ZM0 0H3H37H40V3V37V40H37H3H0V37V3V0ZM6.99994 7H32.9999V13H12.9999V27H26.9999V23H16.9999V17H32.9999V33H6.99994V7Z"
        fill="white"
      />
    </svg>
  )
}

export default memo(GIcon)
