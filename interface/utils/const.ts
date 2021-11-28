import invariant from 'tiny-invariant'

invariant(process.env.NEXT_PUBLIC_CHAIN_ID, 'env NEXT_PUBLIC_CHAIN_ID not set')
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10)

invariant(
  process.env.NEXT_PUBLIC_CRYPTOPUNKS_ADDRESS,
  'env NEXT_PUBLIC_CRYPTOPUNKS_ADDRESS not set',
)
export const CRYPTOPUNKS_ADDRESS = process.env.NEXT_PUBLIC_CRYPTOPUNKS_ADDRESS

invariant(process.env.NEXT_PUBLIC_PUNKGACHA_ADDRESS, 'env NEXT_PUBLIC_PUNKGACHA_ADDRESS not set')
export const PUNKGACHA_ADDRESS = process.env.NEXT_PUBLIC_PUNKGACHA_ADDRESS

invariant(process.env.NEXT_PUBLIC_JSON_PRC_URL, 'env NEXT_PUBLIC_JSON_PRC_URL not set')
export const JSON_PRC_URL = process.env.NEXT_PUBLIC_JSON_PRC_URL

invariant(process.env.NEXT_PUBLIC_ETHERSCAN_PREFIX, 'env NEXT_PUBLIC_ETHERSCAN_PREFIX not set')
export const NEXT_PUBLIC_ETHERSCAN_PREFIX = process.env.NEXT_PUBLIC_ETHERSCAN_PREFIX

export const TWITTER_URL = 'https://twitter.com/team_gacha_in'
export const DISCORD_URL = 'https://discord.gg/xhZuMABtet'
export const CHAINLINK_URL = 'https://chain.link/'
