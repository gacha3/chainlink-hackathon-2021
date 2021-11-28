import { ContractTransaction } from "ethers"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { ethers } from "hardhat"

import {
  loadFixture,
  createFixture,
  mockCryptoPunkSupplies,
  TARGET_PUNK_ID,
  ZERO_ADDRESS,
  getFixturePunkPrice,
} from "./_TestHelper"

const { parseEther } = ethers.utils

// states transitions
describe("state transition: start", () => {
  it("shoud shift to betting after target punk id set", async () => {
    const { punkGacha } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await punkGacha.nextRound(TARGET_PUNK_ID)
    const currentRound = await punkGacha.currentRound()
    expect(currentRound.status).eq(0)
    expect(currentRound.minValue).gt(0)
  })

  it("should not be able to bet if no target punk", async () => {
    const { punkGacha, mockLinkToken } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await mockLinkToken.mock.balanceOf.returns(parseEther("100"))
    await mockLinkToken.mock.transferAndCall.returns(true)

    await expect(punkGacha.bet({ value: parseEther("1") })).to.reverted
  })

  it("should not proceed if no target punk", async () => {
    const { punkGacha, mockLinkToken } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await mockLinkToken.mock.balanceOf.returns(parseEther("100"))
    await mockLinkToken.mock.transferAndCall.returns(true)

    const checkUpkeepResult = await punkGacha.checkUpkeep([0])
    expect(checkUpkeepResult.upkeepNeeded).to.be.false
  })

  it("should do nothing in performUpkeep", async () => {
    const { punkGacha, mockLinkToken } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await mockLinkToken.mock.balanceOf.returns(parseEther("10"))
    // await mockLinkToken.mock.transferAndCall.returns(true)

    await expect(punkGacha.performUpkeep([0])).revertedWith("unknown status")
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await expect(punkGacha.performUpkeep([0])).revertedWith("not enough LINK or ETH")
  })
})

describe("state transition: betting", () => {
  it("should not proceed if not enought ETH", async () => {
    const { punkGacha, mockLinkToken } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await mockLinkToken.mock.balanceOf.returns(parseEther("10"))
    await mockLinkToken.mock.transferAndCall.returns(true)

    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("0.1") })
    const checkUpkeepResult = await punkGacha.checkUpkeep([0])
    expect(checkUpkeepResult.upkeepNeeded).to.be.false
  })

  it("should check target punk price and status", async () => {
    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )

    await mockLinkToken.mock.balanceOf.returns(parseEther("100"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("0.1") })
    await mockCryptoPunksMarket.mock.punksOfferedForSale
      .withArgs(TARGET_PUNK_ID)
      .returns(
        true,
        TARGET_PUNK_ID,
        ZERO_ADDRESS,
        getFixturePunkPrice(TARGET_PUNK_ID).add(1),
        ZERO_ADDRESS,
      )

    const checkUpkeepResult = await punkGacha.checkUpkeep([0])
    expect(checkUpkeepResult.upkeepNeeded).to.be.true
    expect(punkGacha.performUpkeep([0])).emit(punkGacha, "RoundClose")
  })

  it("should shift to waiting randomness if target amount raised", async () => {
    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )

    await mockLinkToken.mock.balanceOf.returns(parseEther("100"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await mockCryptoPunksMarket.mock.buyPunk.returns()

    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("20") })
    const upKeepResult = await punkGacha.checkUpkeep([0])
    expect(upKeepResult.upkeepNeeded).is.true
    let currentRound = await punkGacha.currentRound()
    expect(currentRound.status).eq(0)
    await punkGacha.performUpkeep([0])
    currentRound = await punkGacha.currentRound()
    expect(currentRound.status).eq(1)
  })
})

describe("state transition: buy punk", () => {
  it("should check amount staked in performUpkeep", async () => {
    const { punkGacha } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await expect(punkGacha.performUpkeep([0])).to.be.revertedWith("not enough LINK or ETH")
  })

  it("should abort if target punk price increased", async () => {
    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )

    await mockLinkToken.mock.balanceOf.returns(parseEther("100"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await mockCryptoPunksMarket.mock.buyPunk.returns()

    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("20") })

    // punk price changed
    await mockCryptoPunksMarket.mock.punksOfferedForSale
      .withArgs(TARGET_PUNK_ID)
      .returns(
        true,
        TARGET_PUNK_ID,
        ZERO_ADDRESS,
        getFixturePunkPrice(TARGET_PUNK_ID).mul(2),
        ZERO_ADDRESS,
      )
    await expect(punkGacha.performUpkeep([0])).to.emit(punkGacha, "RoundClose")
    await expect(punkGacha.bet({ value: parseEther("1") })).to.revertedWith("round not open")
  })
})

describe("state transition: waiting randomness", () => {
  it("should proceed to round end", async () => {
    const [signer] = await ethers.getSigners()

    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )

    await mockLinkToken.mock.balanceOf.returns(parseEther("100"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await mockCryptoPunksMarket.mock.buyPunk.returns()
    await mockCryptoPunksMarket.mock.offerPunkForSaleToAddress
      .withArgs(TARGET_PUNK_ID, 0, signer.address)
      .returns()

    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("20") })
    await punkGacha.performUpkeep([0])

    await punkGacha.xfulfillRandomness(formatBytes32String(""), ethers.BigNumber.from(1))
    await expect(punkGacha.performUpkeep([0])).emit(punkGacha, "RoundClose")
  })
})

describe("estimate gas", () => {
  it("", async () => {
    const [signer, ...accounts] = await ethers.getSigners()

    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )

    await mockLinkToken.mock.balanceOf.returns(parseEther("100"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await mockCryptoPunksMarket.mock.buyPunk.returns()
    await mockCryptoPunksMarket.mock.offerPunkForSaleToAddress.returns()
    let tx: ContractTransaction
    await expect(punkGacha.nextRound(10000)).to.revertedWith("invalid punk index")
    await punkGacha.nextRound(TARGET_PUNK_ID)

    tx = await punkGacha.bet({ value: parseEther("20") })
    console.log("bet first gas: ", (await tx.wait()).gasUsed.toString())
    tx = await punkGacha.bet({ value: parseEther("20") })
    console.log("bet followup gas: ", (await tx.wait()).gasUsed.toString())

    const bets = []
    for (let i = 0; i < 1000; i++) {
      const req = punkGacha
        .connect(accounts[i % accounts.length])
        .bet({ value: parseEther("0.01") })
      bets.push(req)
    }
    await Promise.all(bets)

    tx = await punkGacha.refund([0, 1])
    console.log("refund gas: ", (await tx.wait()).gasUsed.toString())

    if (await punkGacha.checkUpkeep([])) {
      tx = await punkGacha.performUpkeep([0])
      console.log("performUpkeep gas: ", (await tx.wait()).gasUsed.toString())
    }

    await expect(
      punkGacha.xfulfillRandomness(formatBytes32String(""), ethers.BigNumber.from(1)),
    ).to.revertedWith("round not drawing")

    if (await punkGacha.checkUpkeep([])) {
      tx = await punkGacha.performUpkeep([0])
      console.log("performUpkeep gas: ", (await tx.wait()).gasUsed.toString())
    }

    await expect(punkGacha.performUpkeep([0])).to.revertedWith("randomness not fulfilled")

    await expect(punkGacha.nextRound(0)).to.revertedWith("round not close")

    expect(await punkGacha.checkUpkeep([])).to.be.deep.equal([false, "0x"])

    tx = await punkGacha.xfulfillRandomness(
      formatBytes32String(""),
      (await punkGacha.totalAmount()).add(-1),
    )
    console.log("fulfillRandomness gas: ", (await tx.wait()).gasUsed.toString())
  })
})
