const { smock } = require('@defi-wonderland/smock')
const { ROUTER } = require('../../data/addresses.json').mainnet

const deployMockERC20 = async (settings) => {
  const erc20 = settings
    ? await smock.fake('Token', settings)
    : await smock.fake('Token')
  await erc20.deployed()
  return erc20
}

const deployMockRouter = async () => {
  const router = await smock.fake('IUniswapV2Router02', { address: ROUTER })
  await router.deployed()
  router.addLiquidity.returns()
  return router
}

const deployMockMasterChef = async (settings) => {
  const masterChef = settings
    ? await smock.fake('IMasterChef', settings)
    : await smock.fake('IMasterChef')

  await masterChef.deployed()
  return masterChef
}

module.exports = { deployMockERC20, deployMockRouter, deployMockMasterChef }
