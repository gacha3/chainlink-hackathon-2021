import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { ethers } from "hardhat"

import { loadFixture, createFixture, ZERO_ADDRESS } from "./_TestHelper"

const { parseEther } = ethers.utils

const PUNK_INDEX = 7777

describe.skip("monkey", () => {
  it("test", async function () {
    this.timeout(5 * 60 * 1000)

    const accounts = await ethers.getSigners()

    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(createFixture({}))
    await mockCryptoPunksMarket.mock.totalSupply.returns(10000)
    await mockCryptoPunksMarket.mock.punksOfferedForSale
      .withArgs(PUNK_INDEX)
      .returns(true, PUNK_INDEX, ZERO_ADDRESS, parseEther("89.7777"), ZERO_ADDRESS)

    await mockLinkToken.mock.balanceOf.returns(parseEther("100"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await mockCryptoPunksMarket.mock.buyPunk.returns()
    await mockCryptoPunksMarket.mock.offerPunkForSaleToAddress.returns()

    await punkGacha.nextRound(PUNK_INDEX)

    const betCount = Math.floor(Math.random() * 2000 + 5000)
    console.log("betCount:", betCount)

    await Promise.all(
      Array.from({ length: betCount }).map(async (_, i) => {
        if (Math.random() < 0.02 && i > accounts.length) {
          try {
            // console.log("refund:", accounts[i % accounts.length].address, i - accounts.length)
            await punkGacha.connect(accounts[i % accounts.length]).refund([i - accounts.length])
          } catch {}
        } else {
          await punkGacha
            .connect(accounts[i % accounts.length])
            .bet({ value: parseEther((Math.random() + 0.01).toString().substr(0, 16)) })
        }
      }),
    )

    await punkGacha.performUpkeep([0])
    punkGacha.xfulfillRandomness(formatBytes32String(""), (await punkGacha.totalAmount()).add(-1))

    await expect(punkGacha.performUpkeep([0]))
      .to.emit(punkGacha, "RoundClose")
      .withArgs(1, accounts[(betCount - 1) % accounts.length].address, PUNK_INDEX)
  })
})
