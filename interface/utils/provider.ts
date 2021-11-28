import { ethers } from 'ethers'
import { JSON_PRC_URL } from './const'

export const jsonRpcBatchProvider = new ethers.providers.JsonRpcBatchProvider(JSON_PRC_URL)
