import { expect } from "chai"
import { ethers } from "hardhat"

import { XGachaState } from "../typechain-types"

describe("GachaState basic", () => {
  let gachaState: XGachaState
  const address1 = "0x1111111111111111111111111111111111111111"
  const address2 = "0x2222222222222222222222222222222222222222"

  before(async () => {
    const GachaState = await ethers.getContractFactory("XGachaState")
    gachaState = (await GachaState.deploy()) as XGachaState
    await gachaState.deployed()
  })

  it("Should has initial state", async () => {
    expect(await gachaState.chipsCount()).to.equal(ethers.BigNumber.from(0))
    expect(await gachaState.totalAmount()).to.equal(ethers.BigNumber.from(0))
  })

  it("Should increase amount after stake", async () => {
    await gachaState.x_stake({ player: address1, amount: ethers.utils.parseEther("0.01") })
    expect(await gachaState.chipsCount()).to.equal(ethers.BigNumber.from(1))
    expect(await gachaState.totalAmount()).to.equal(ethers.utils.parseEther("0.01"))
    expect((await gachaState.chips(0)).amount).to.equal(ethers.utils.parseEther("0.01"))
  })

  it("Should increase amount after stake again", async () => {
    await gachaState.x_stake({ player: address1, amount: ethers.utils.parseEther("0.01") })
    expect(await gachaState.chipsCount()).to.equal(ethers.BigNumber.from(2))
    expect(await gachaState.totalAmount()).to.equal(ethers.utils.parseEther("0.02"))
    expect((await gachaState.chips(1)).amount).to.equal(ethers.utils.parseEther("0.01"))
  })

  it("Should staked by another account", async () => {
    await gachaState.x_stake({ player: address2, amount: ethers.utils.parseEther("0.01") })
    expect(await gachaState.chipsCount()).to.equal(ethers.BigNumber.from(3))
    expect(await gachaState.totalAmount()).to.equal(ethers.utils.parseEther("0.03"))
    expect((await gachaState.chips(2)).amount).to.equal(ethers.utils.parseEther("0.01"))
  })

  it("Should pick 1", async () => {
    expect(await gachaState.x_pick(ethers.utils.parseEther("0"))).to.equal(address1)
  })

  it("Should pick 1", async () => {
    expect(await gachaState.x_pick(ethers.utils.parseEther("0.01"))).to.equal(address1)
  })

  it("Should pick 2", async () => {
    expect(await gachaState.x_pick(ethers.utils.parseEther("0.02"))).to.equal(address2)
  })

  it("Should pick 1", async () => {
    expect(await gachaState.x_pick(ethers.utils.parseEther("0.03"))).to.equal(address1)
  })

  it("Should refund", async () => {
    await gachaState.x_refund(address2, [2])
    expect(await gachaState.chipsCount()).to.equal(3) // chips not deleted
    expect(await gachaState.totalAmount()).to.equal(ethers.utils.parseEther("0.02"))
  })

  it("should not refund again", async () => {
    await gachaState.x_refund(address2, [2])
    expect(await gachaState.totalAmount()).to.equal(ethers.utils.parseEther("0.02"))
  })

  it("Should reset", async () => {
    await gachaState.x_reset()
    expect(await gachaState.chipsCount()).to.equal(ethers.BigNumber.from(0))
    expect(await gachaState.totalAmount()).to.equal(ethers.utils.parseEther("0"))
  })
})

describe("GachaState advanced", () => {
  let gachaState: XGachaState

  before(async () => {
    const GachaState = await ethers.getContractFactory("XGachaState")
    gachaState = (await GachaState.deploy()) as XGachaState
    await gachaState.deployed()
  })

  it("Should auto set segment", async () => {
    const accounts = await ethers.getSigners()

    expect(await gachaState.segmentsCount()).to.equal(0)

    await Promise.all(
      Array.from({ length: 112 }).map(async (_, i) => {
        await gachaState.x_stake({
          player: accounts[i % accounts.length].address,
          amount: ethers.utils.parseEther("0.01"),
        })
      }),
    )

    expect(await gachaState.segmentsCount()).to.equal(1)
    expect(await gachaState.segments(0)).to.equal(ethers.utils.parseEther("1"))

    expect(await gachaState.x_pick(ethers.utils.parseEther("1.01"))).to.equal(
      accounts[101 % accounts.length].address,
    )
    expect(await gachaState.x_pick(ethers.utils.parseEther("0.77"))).to.equal(
      accounts[77 % accounts.length].address,
    )

    await gachaState.x_reset()
  })

  it("Should manual set segment", async () => {
    const accounts = await ethers.getSigners()

    await Promise.all(
      Array.from({ length: 103 }).map(async (_, i) => {
        await gachaState.x_stake({
          player: accounts[i % accounts.length].address,
          amount: ethers.utils.parseEther("0.01"),
        })
      }),
    )

    expect(await gachaState.segmentsCount()).to.equal(0)

    if (await gachaState.x_checkMaintainSegment(0)) {
      await gachaState.x_performMaintainSegment()
    }

    expect(await gachaState.segmentsCount()).to.equal(1)
    expect(await gachaState.segments(0)).to.equal(ethers.utils.parseEther("1"))

    await gachaState.x_refund(accounts[0].address, [0])

    expect(await gachaState.x_pick(ethers.utils.parseEther("1.01"))).to.equal(
      accounts[102 % accounts.length].address,
    )
    expect(await gachaState.x_pick(ethers.utils.parseEther("0.77"))).to.equal(
      accounts[78 % accounts.length].address,
    )

    await gachaState.x_reset()
  })
})
