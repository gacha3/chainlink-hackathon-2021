import { ButtonHTMLAttributes, FC, memo } from 'react'
import classnames from 'classnames'

interface Props {
  variant?: 'primary' | 'ghost'
}

const Button: FC<Props & ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const { variant = 'primary', className, ...buttonProps } = props
  return (
    <button
      type="button"
      {...buttonProps}
      className={classnames(
        'px-4 py-3.5 text-base font-bold focus:outline-none disabled:cursor-not-allowed transition-colors duration-200',
        variant === 'primary' &&
          'bg-white text-black disabled:bg-white/50 border border-transparent hover:bg-gray-200 focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-offset-black focus-visible:ring-offset-2',
        variant === 'ghost' && 'border-white border-[3px] text-white',
        className,
      )}
    />
  )
}

export default memo(Button)
