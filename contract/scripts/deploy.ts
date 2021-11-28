import { BigNumberish, BytesLike } from "ethers"
import { run, ethers, network } from "hardhat"

const initialParams: {
  [key: string]: [string, string, BytesLike, BigNumberish, string]
} = {
  mainnet: [
    "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952",
    "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445",
    "2000000000000000000",
    "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
  ],
  kovan: [
    "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    "0xa36085F69e2889c224210F603D836748e7dC0088",
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    "100000000000000000",
    "0x5B4018eA08Fd925709A31A86b2AC0d3a75628C0b",
  ],
}

async function main() {
  await run("compile")

  const [deployer] = await ethers.getSigners()

  if (deployer) {
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())
  }

  const Contract = await ethers.getContractFactory("PunkGacha")
  const contract = await Contract.deploy(...initialParams[network.name])

  console.log("Contract address:", contract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
