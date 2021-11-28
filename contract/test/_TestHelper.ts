import { ethers, waffle } from "hardhat"
import { MockContract } from "@ethereum-waffle/mock-contract"
import LinkTokenAbi from "@chainlink/contracts/abi/v0.4/LinkToken.json"

import { XPunkGacha } from "../typechain-types"
import CryptoPunksMarketAbi from "../abi/CryptoPunksMarket.json"

const { parseEther } = ethers.utils

export const loadFixture = waffle.createFixtureLoader(undefined, waffle.provider)

export const TOTAL_SUPPLY = 10
export const ZERO_ADDRESS = ethers.utils.getAddress("0x0000000000000000000000000000000000000000")
export const FOR_SALE_INDEXES = [3, 4, 5, 6]
export const TARGET_PUNK_ID = 6
export const FOR_SALE_PUNK_PRICES = { 3: 6, 4: 9, 5: 10, 6: 7 } as { [key: number]: number } // ether

export function getFixturePunkPrice(punkId: number) {
  const forSale = FOR_SALE_INDEXES.includes(punkId)
  return parseEther(forSale ? FOR_SALE_PUNK_PRICES[punkId].toString() : "10")
}

export type MockFunction = (contract: MockContract) => Promise<void>

export async function mockCryptoPunkSupplies(mockCryptoPunksMarket: MockContract) {
  await mockCryptoPunksMarket.mock.totalSupply.returns(TOTAL_SUPPLY)
  for (let i = 0; i < TOTAL_SUPPLY; i++) {
    const forSale = FOR_SALE_INDEXES.includes(i)
    await mockCryptoPunksMarket.mock.punksOfferedForSale
      .withArgs(i)
      .returns(forSale, i, ZERO_ADDRESS, getFixturePunkPrice(i), ZERO_ADDRESS)
  }
}

export function createFixture(
  mocks: {
    cryptoPunksMarket?: MockFunction
    linkToken?: MockFunction
  } = {},
) {
  return async function () {
    const [signer, ...accounts] = await ethers.getSigners()

    const mockCryptoPunksMarket = await waffle.deployMockContract(signer, CryptoPunksMarketAbi)
    await mocks.cryptoPunksMarket?.(mockCryptoPunksMarket)

    const mockLinkToken = await waffle.deployMockContract(signer, LinkTokenAbi)
    await mocks.linkToken?.(mockLinkToken)

    const PunkGacha = await ethers.getContractFactory("XPunkGacha")
    const punkGacha = (await PunkGacha.deploy(
      "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
      mockLinkToken.address,
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
      parseEther("1"),
      mockCryptoPunksMarket.address,
    )) as XPunkGacha
    await punkGacha.deployed()

    return { punkGacha, mockCryptoPunksMarket, mockLinkToken, signer, accounts }
  }
}
