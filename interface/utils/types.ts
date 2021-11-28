import { BigNumber } from 'ethers'

export type Round = [BigNumber, BigNumber, number, number] & {
  minValue: BigNumber
  id: BigNumber
  punkIndex: number
  status: RoundStatus
}

export enum RoundStatus {
  OPEN,
  DRAW,
  CLOSE,
}
