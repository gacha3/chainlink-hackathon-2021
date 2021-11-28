import { task, HardhatUserConfig } from "hardhat/config"
import { config as dotenv } from "dotenv"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "@typechain/hardhat"
import "hardhat-exposed"

dotenv()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.10",
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 200,
    //   },
    // },
  },
  networks: {
    mainnet: {
      url: "https://cloudflare-eth.com/",
      chainId: 1,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    kovan: {
      url: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 42,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      // forking: {
      //   url: "https://cloudflare-eth.com/",
      // },
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

export default config
