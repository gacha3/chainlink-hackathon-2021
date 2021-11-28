import { createContext, useContext } from 'react'
import { PunkGacha__factory } from '../abi'
import { PUNKGACHA_ADDRESS } from '../utils/const'
import { jsonRpcBatchProvider } from '../utils/provider'

export const punkGachaContract = PunkGacha__factory.connect(PUNKGACHA_ADDRESS, jsonRpcBatchProvider)

export const PunkGachaContractContext = createContext(punkGachaContract)

export const PunkGachaContractProvider = PunkGachaContractContext.Provider
