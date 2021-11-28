import { expect } from "chai"
import { ethers } from "hardhat"

import {
  loadFixture,
  createFixture,
  mockCryptoPunkSupplies,
  TARGET_PUNK_ID,
  ZERO_ADDRESS,
  FOR_SALE_PUNK_PRICES,
} from "./_TestHelper"

enum RoundStatus {
  OPEN,
  DRAW,
  CLOSE,
}
const { parseEther, formatBytes32String } = ethers.utils

describe("nextRound", () => {
  it("nextRound success and should chose target punk", async () => {
    const { punkGacha } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await punkGacha.nextRound(TARGET_PUNK_ID)
    const { punkIndex } = await punkGacha.currentRound()
    expect(punkIndex).to.equal(TARGET_PUNK_ID)
  })

  it("nextRound fail", async () => {
    const { punkGacha } = await loadFixture(createFixture())
    await expect(punkGacha.nextRound(10000)).revertedWith("invalid punk index")
  })
})

describe("bet", () => {
  it("bet should fail without minimum value", async () => {
    const { punkGacha } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await expect(punkGacha.bet({ value: parseEther("0.001") })).to.be.revertedWith("bet too less")
  })

  it("bet success", async () => {
    const { punkGacha, signer, accounts } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await punkGacha.nextRound(TARGET_PUNK_ID)

    expect(await punkGacha.totalAmount()).to.equal(0)
    expect(await punkGacha.chipsCount()).to.equal(0)

    await expect(await punkGacha.connect(signer).bet({ value: parseEther("0.01") }))
      .to.changeEtherBalance(punkGacha, parseEther("0.01"))
      .to.emit(punkGacha, "PlayerBet")
      .withArgs(1, signer.address, parseEther("0.01"))

    expect(await punkGacha.totalAmount()).to.equal(parseEther("0.01"))
    expect(await punkGacha.chipsCount()).to.equal(1)
    expect((await punkGacha.chips(0)).amount).to.equal(parseEther("0.01"))
    expect((await punkGacha.chips(0)).player).to.equal(signer.address)

    await expect(
      await punkGacha.connect(accounts[0]).bet({ value: parseEther("0.02") }),
    ).to.changeEtherBalance(punkGacha, parseEther("0.02"))

    expect(await punkGacha.totalAmount()).to.equal(parseEther("0.03"))
    expect(await punkGacha.chipsCount()).to.equal(2)
    expect((await punkGacha.chips(0)).amount).to.equal(parseEther("0.01"))
    expect((await punkGacha.chips(1)).amount).to.equal(parseEther("0.02"))
    expect((await punkGacha.chips(0)).player).to.equal(signer.address)
    expect((await punkGacha.chips(1)).player).to.equal(accounts[0].address)
  })

  it("bet more amount by same player", async () => {
    const { punkGacha, signer } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await punkGacha.nextRound(TARGET_PUNK_ID)

    await expect(
      await punkGacha.connect(signer).bet({ value: parseEther("0.01") }),
    ).to.changeEtherBalance(punkGacha, parseEther("0.01"))

    expect(await punkGacha.totalAmount()).to.equal(parseEther("0.01"))
    expect(await punkGacha.chipsCount()).to.equal(1)
    expect((await punkGacha.chips(0)).amount).to.equal(parseEther("0.01"))
    expect((await punkGacha.chips(0)).player).to.equal(signer.address)

    await expect(
      await punkGacha.connect(signer).bet({ value: parseEther("0.01") }),
    ).to.changeEtherBalance(punkGacha, parseEther("0.01"))

    expect(await punkGacha.totalAmount()).to.equal(parseEther("0.02"))
    expect(await punkGacha.chipsCount()).to.equal(2)
    expect((await punkGacha.chips(1)).amount).to.equal(parseEther("0.01"))
    expect((await punkGacha.chips(1)).player).to.equal(signer.address)
  })
})

describe("checkUpkeep", () => {
  it("checkUpkeep fail if not enough LINK", async () => {
    const { punkGacha, mockCryptoPunksMarket, mockLinkToken } = await loadFixture(createFixture())
    await mockCryptoPunkSupplies(mockCryptoPunksMarket)
    await mockLinkToken.mock.balanceOf.returns(parseEther("0.1"))
    await punkGacha.nextRound(TARGET_PUNK_ID)
    const [passed] = await punkGacha.checkUpkeep("0x")
    expect(passed).to.equal(false)
  })

  it("checkUpkeep fail if not enough stake", async () => {
    const { punkGacha, mockCryptoPunksMarket, mockLinkToken } = await loadFixture(createFixture())
    await mockCryptoPunkSupplies(mockCryptoPunksMarket)
    await mockLinkToken.mock.balanceOf.returns(parseEther("10"))
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("0.1") })
    const [passed] = await punkGacha.checkUpkeep("0x")
    expect(passed).to.equal(false)
  })

  it("checkUpkeep success", async () => {
    const { punkGacha, mockCryptoPunksMarket, mockLinkToken } = await loadFixture(createFixture())
    await mockCryptoPunkSupplies(mockCryptoPunksMarket)
    await mockLinkToken.mock.balanceOf.returns(parseEther("10"))
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther((10 * 2).toString()) })
    const [passed] = await punkGacha.checkUpkeep("0x")
    expect(passed).to.equal(true)
  })
})

describe("refund", () => {
  it("refund fail without staked amount", async () => {
    const { punkGacha } = await loadFixture(createFixture())
    await expect(punkGacha.refund([])).to.revertedWith("nothing to refund")
  })

  it("refund success", async () => {
    const { punkGacha, signer } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )

    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("1") })

    expect(await punkGacha.refund([0]))
      .to.changeEtherBalances([punkGacha, signer], [parseEther("-1"), parseEther("1")])
      .to.emit(punkGacha, "PlayerRefund")
      .withArgs(1, signer.address, parseEther("1"))

    expect(await punkGacha.totalAmount()).to.equal(0)
    expect(await punkGacha.chipsCount()).to.equal(1)

    await expect(punkGacha.refund([0])).to.be.revertedWith("nothing to refund")
  })
})

describe("performUpkeep", () => {
  it("should end round if price raised", async () => {
    const { punkGacha, mockCryptoPunksMarket } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await punkGacha.nextRound(TARGET_PUNK_ID)
    const { punkIndex } = await punkGacha.currentRound()

    await mockCryptoPunksMarket.mock.punksOfferedForSale
      .withArgs(punkIndex)
      .returns(true, punkIndex, ZERO_ADDRESS, parseEther("10"), ZERO_ADDRESS)

    await expect(punkGacha.performUpkeep([0]))
      .to.emit(punkGacha, "RoundClose")
      .withArgs(1, ZERO_ADDRESS, TARGET_PUNK_ID)
  })

  it("should check enough ETH to buy", async () => {
    const { punkGacha } = await loadFixture(
      createFixture({ cryptoPunksMarket: mockCryptoPunkSupplies }),
    )
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await expect(punkGacha.performUpkeep([0])).revertedWith("not enough LINK or ETH")
  })

  it("should check enough LINK", async () => {
    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(createFixture())
    await mockCryptoPunkSupplies(mockCryptoPunksMarket)
    await mockLinkToken.mock.balanceOf.returns(parseEther("0.1"))
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("10") })
    await expect(punkGacha.performUpkeep([0])).revertedWith("not enough LINK or ETH")
  })

  it("should buy punk", async () => {
    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(createFixture())
    await mockCryptoPunkSupplies(mockCryptoPunksMarket)
    await mockLinkToken.mock.balanceOf.returns(parseEther("10"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await mockCryptoPunksMarket.mock.buyPunk.returns()

    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("10") })

    expect((await punkGacha.currentRound()).status).to.equal(RoundStatus.OPEN)
    await punkGacha.performUpkeep([0])
    expect((await punkGacha.currentRound()).status).to.equal(RoundStatus.DRAW)
  })
})

describe("fulfillRandomness", () => {
  async function setup() {
    const { punkGacha, mockLinkToken, mockCryptoPunksMarket } = await loadFixture(createFixture())
    await mockCryptoPunkSupplies(mockCryptoPunksMarket)
    await mockLinkToken.mock.balanceOf.returns(parseEther("10"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await mockCryptoPunksMarket.mock.buyPunk.returns()
    await mockCryptoPunksMarket.mock.offerPunkForSaleToAddress.returns()
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.bet({ value: parseEther("10") })
    await punkGacha.performUpkeep([0])
    return { punkGacha }
  }

  it("success path", async () => {
    const { punkGacha } = await setup()

    await punkGacha.xfulfillRandomness(formatBytes32String(""), ethers.BigNumber.from(1))
    await expect(punkGacha.performUpkeep([0])).to.emit(punkGacha, "RoundClose")

    expect((await punkGacha.currentRound()).status).to.equal(RoundStatus.CLOSE)

    expect(await punkGacha.chipsCount()).to.equal(0)
    expect(await punkGacha.totalAmount()).to.equal(0)
  })
})

describe("withdraw", () => {
  async function setup() {
    const { punkGacha, mockLinkToken, mockCryptoPunksMarket, signer, accounts } = await loadFixture(
      createFixture(),
    )
    await mockCryptoPunkSupplies(mockCryptoPunksMarket)
    await mockLinkToken.mock.balanceOf.returns(parseEther("10"))
    await mockLinkToken.mock.transferAndCall.returns(true)
    await mockCryptoPunksMarket.mock.buyPunk.returns()
    await mockCryptoPunksMarket.mock.offerPunkForSaleToAddress.returns()
    await punkGacha.nextRound(TARGET_PUNK_ID)
    await punkGacha.connect(accounts[0]).bet({ value: parseEther("10") })
    return { punkGacha, signer, accounts }
  }

  it("owner can withdraw", async () => {
    const { punkGacha, signer } = await setup()
    await punkGacha.performUpkeep([0])
    await punkGacha.xfulfillRandomness(formatBytes32String(""), ethers.BigNumber.from(1))
    await punkGacha.performUpkeep([0])
    const withdrawableBalance = 10 - FOR_SALE_PUNK_PRICES[TARGET_PUNK_ID]
    expect(await punkGacha.withdraw()).to.changeEtherBalances(
      [punkGacha, signer],
      [parseEther((-withdrawableBalance).toString()), parseEther(withdrawableBalance.toString())],
    )
  })

  it("only owner can withdraw", async () => {
    const { punkGacha, signer, accounts } = await setup()
    await punkGacha.performUpkeep([0])
    await punkGacha.xfulfillRandomness(formatBytes32String(""), ethers.BigNumber.from(1))
    await expect(punkGacha.connect(accounts[0]).withdraw()).to.be.revertedWith(
      "Ownable: caller is not the owner",
    )
  })

  it("owner can only withdraw when closed", async () => {
    const { punkGacha } = await setup()
    await expect(punkGacha.withdraw()).to.be.revertedWith("round not close")
  })
})
