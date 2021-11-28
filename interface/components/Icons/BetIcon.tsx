import { FC, memo } from 'react'

interface Props {
  fill?: string
}

const BetIcon: FC<Props> = (props) => {
  const { fill = 'black' } = props
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.9506 17H29.9648C29.7451 20.1139 28.5069 22.9467 26.5815 25.1673L23.7429 22.3287L23.7429 22.3287C24.9554 20.8472 25.7509 19.0112 25.9506 17ZM22.3287 23.7429L25.1673 26.5815C22.9467 28.5069 20.1139 29.7451 17 29.9648V25.9506C19.0115 25.7509 20.8477 24.9551 22.3293 23.7424L22.3287 23.7429ZM15 25.9506V29.9648C11.8861 29.7451 9.05332 28.5069 6.83274 26.5815L9.67127 23.7429L9.67125 23.7429C11.1528 24.9554 12.9888 25.7509 15 25.9506ZM8.25705 22.3287L5.41853 25.1673C3.49306 22.9467 2.25493 20.1139 2.03516 17H6.04938C6.24906 19.0112 7.04464 20.8472 8.25705 22.3287ZM25.9506 15H29.9648C29.7451 11.8861 28.5069 9.05332 26.5815 6.83274L23.7429 9.67127L23.7426 9.67088C24.9552 11.1525 25.7509 12.9886 25.9506 15ZM17 2.03516C20.1139 2.25493 22.9467 3.49306 25.1673 5.41853L22.3287 8.25705C20.8472 7.04464 19.0112 6.24906 17 6.04938V2.03516ZM15 2.03516V6.04938C12.9888 6.24906 11.1528 7.04464 9.67127 8.25705L6.83274 5.41853C9.05332 3.49306 11.8861 2.25493 15 2.03516ZM5.41853 6.83274L8.25706 9.67127C7.04464 11.1528 6.24906 12.9888 6.04938 15H2.03516C2.25493 11.8861 3.49306 9.05332 5.41853 6.83274ZM32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16ZM12 11V13H20V11H12ZM12 19V21H20V19H12ZM19 17H13V15H19V17Z"
        fill={fill}
      />
    </svg>
  )
}

export default memo(BetIcon)
