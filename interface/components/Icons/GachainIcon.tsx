import { FC, memo } from 'react'

interface Props {
  fill?: string
}

const GachainIcon: FC<Props> = (props) => {
  const { fill = 'black' } = props
  return (
    <svg
      width="224"
      height="52"
      viewBox="0 0 224 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M38.9999 13H12.9999V39H38.9999V23H22.9999V29H32.9999V33H18.9999V19H38.9999V13Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M79 13H53V39H59V30.5H73V39H79V13ZM73 24.5H59V19H73V24.5Z"
        fill={fill}
      />
      <path d="M119 13H93V39H119V33H99V19H119V13Z" fill={fill} />
      <path d="M139 23V13H133V39H139V29H153V39H159V13H153V23H139Z" fill={fill} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M173 13H199V39H193V30.5H179V39H173V13ZM179 24.5H193V19H179V24.5Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 46V6H206V46H6ZM9 9H43V43H9V9ZM49 9H83V43H49V9ZM123 9H89V43H123V9ZM129 9H163V43H129V9ZM203 9H169V43H203V9Z"
        fill={fill}
      />
      <path d="M211 6H209V13H211V6Z" fill={fill} />
      <path d="M212 13V6H214L216 9.5V6H218V13H216L214 9.5V13H212Z" fill={fill} />
      <path
        d="M214.46 15H212.46V20.5858L210.914 19.0395L209.5 20.4537L213.46 24.4142L217.422 20.4527L216.008 19.0385L214.46 20.5858V15Z"
        fill={fill}
      />
      <path d="M214.5 36.5H212.5V42.5H214.5V36.5Z" fill={fill} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M209 28V46H218V28H209ZM216 30H211V44H216V30Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.97333 0H0V52H5.97332H224V46V6V0H5.97333ZM221.013 3H2.98667V6V49H5.97332H221.013V46V6V3Z"
        fill={fill}
      />
    </svg>
  )
}

export default memo(GachainIcon)
