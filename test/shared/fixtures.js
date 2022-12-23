const { ethers } = require('hardhat')
const { WETH, SLP, DAI, MASTER_CHEF, MASTER_CHEF_V2, ROUTER } =
  require('../../data/addresses.json').mainnet

const {
  deployMockRouter,
  deployMockMasterChef,
  deployMockERC20,
} = require('./mocks')

const ercAbi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function deposit() public payable',
  'function approve(address spender, uint256 amount) returns (bool)',
]

const deployWalletFixture = async () => {
  const WalletContract = await ethers.getContractFactory('SushiSwapWallet')
  const walletContract = await WalletContract.deploy()

  return { walletContract }
}

const deploySelfDestructWalletFixture = async () => {
  const SelfDestructWallet = await ethers.getContractFactory(
    'SelfDestructWallet'
  )
  const selfDestructWallet = await SelfDestructWallet.deploy()

  return { selfDestructWallet }
}

const deployWalletFactoryFixture = async () => {
  const WalletFactory = await ethers.getContractFactory('WalletFactory')
  const walletFactory = await WalletFactory.deploy()

  return { walletFactory }
}

const deploySushiSwapEcosystemFixture = async () => {
  const [wallet] = await ethers.getSigners()

  const mockRouter = await deployMockRouter(wallet)
  const mockMasterChef = await deployMockMasterChef({
    address: MASTER_CHEF,
  })
  const mockMasterChefV2 = await deployMockMasterChef({
    address: MASTER_CHEF_V2,
  })
  const mockToken1 = await deployMockERC20({
    address: WETH,
  })
  const mockToken2 = await deployMockERC20({
    address: DAI,
  })
  const mockToken3 = await deployMockERC20({
    address: SLP,
  })

  return {
    mockRouter,
    mockMasterChef,
    mockToken1,
    mockToken2,
    mockToken3,
    mockMasterChefV2,
  }
}

const loadSushiSwapEcosystemFixture = async () => {
  const [wallet] = await ethers.getSigners()

  const routerContract = await ethers.getContractAt(
    'IUniswapV2Router02',
    ROUTER
  )
  const masterChefContract = await ethers.getContractAt(
    'IMasterChef',
    MASTER_CHEF
  )

  const masterChefV2Contract = await ethers.getContractAt(
    'IMasterChef',
    MASTER_CHEF_V2
  )

  const token1Contract = new ethers.Contract(WETH, ercAbi, wallet)
  const token2Contract = new ethers.Contract(DAI, ercAbi, wallet)
  const token3Contract = new ethers.Contract(SLP, ercAbi, wallet)

  return {
    routerContract,
    masterChefContract,
    masterChefV2Contract,
    token1Contract,
    token2Contract,
    token3Contract,
  }
}

module.exports = {
  deployWalletFixture,
  deploySushiSwapEcosystemFixture,
  deploySelfDestructWalletFixture,
  deployWalletFactoryFixture,
  loadSushiSwapEcosystemFixture,
}
