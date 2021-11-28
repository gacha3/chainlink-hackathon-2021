import { createContext, useContext } from 'react'
import { CryptoPunksMarket__factory } from '../abi'
import { CRYPTOPUNKS_ADDRESS } from '../utils/const'
import { jsonRpcBatchProvider } from '../utils/provider'

export const cryptoPunksContract = CryptoPunksMarket__factory.connect(
  CRYPTOPUNKS_ADDRESS,
  jsonRpcBatchProvider,
)

export const CryptoPunksContractContext = createContext(cryptoPunksContract)

export const CryptoPunksContractProvider = CryptoPunksContractContext.Provider
