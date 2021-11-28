import { CSSProperties, FC, HTMLAttributes, memo, useMemo } from 'react'
import classnames from 'classnames'
import styles from '../styles/cryptopunk.module.css'

interface Props {
  id: string | number
  scale: number
}

const PUNK_BASE_SIZE = -24

const CryptoPunkImage: FC<Props & HTMLAttributes<HTMLDivElement>> = (props) => {
  const { id, scale, className } = props

  const style: CSSProperties = useMemo(() => {
    const numberId = parseInt(id as string, 10)
    const x = (numberId % 100) * PUNK_BASE_SIZE
    const y = Math.floor(numberId / 100) * PUNK_BASE_SIZE
    return {
      backgroundPosition: `${x}px ${y}px`,
      transform: `scale(${scale})`,
    }
  }, [id, scale])

  return <div className={classnames(styles.cryptopunk, className)} style={style} />
}

export default memo(CryptoPunkImage)
