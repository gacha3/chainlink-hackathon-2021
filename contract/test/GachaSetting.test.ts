import { expect } from "chai"
import { ethers } from "hardhat"

import { XGachaSetting } from "../typechain-types"

describe("GachaSetting", () => {
  let gachaSetting: XGachaSetting

  before(async () => {
    const GachaSetting = await ethers.getContractFactory("XGachaSetting")
    gachaSetting = (await GachaSetting.deploy()) as XGachaSetting
    await gachaSetting.deployed()
  })

  it("Should set service fee thousandth", async () => {
    expect(await gachaSetting.serviceFeeThousandth()).to.equal(ethers.BigNumber.from("100"))
    await gachaSetting.setServiceFeeThousandth(ethers.BigNumber.from("50"))
    expect(await gachaSetting.serviceFeeThousandth()).to.equal(ethers.BigNumber.from("50"))
  })

  it("Should set minimum bet value", async () => {
    expect(await gachaSetting.minimumBetValue()).to.equal(ethers.utils.parseEther("0.01"))
    await gachaSetting.setMinimumBetValue(ethers.utils.parseEther("0.02"))
    expect(await gachaSetting.minimumBetValue()).to.equal(ethers.utils.parseEther("0.02"))
  })

  it("Should set maximum punk value", async () => {
    expect(await gachaSetting.maximumPunkValue()).to.equal(ethers.utils.parseEther("200"))
    await gachaSetting.setMaximumPunkValue(ethers.utils.parseEther("100"))
    expect(await gachaSetting.maximumPunkValue()).to.equal(ethers.utils.parseEther("100"))
  })

  it("Should set paused", async () => {
    expect(await gachaSetting.isPaused()).to.equal(false)
    await gachaSetting.setIsPaused(true)
    expect(await gachaSetting.isPaused()).to.equal(true)
  })
})
