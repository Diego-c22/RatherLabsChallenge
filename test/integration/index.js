const { ethers } = require('hardhat')
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const {
  loadSushiSwapEcosystemFixture,
  deployWalletFixture,
  deployWalletFactoryFixture,
} = require('../shared/fixtures')
const { depositIT } = require('./Wallet/deposit')
const { executeIT } = require('./Wallet/execute')
const { ercAbi } = require('../shared/shortABIs')
const {
  executeWithSLPTokenAddressIT,
} = require('./Wallet/executeWithSLPTokenAddress')
const { walletActionIT } = require('./MetamophicFactoryWallet/walletAction')

const { WETH, ALCX, DAI, ROUTER } = require('../../data/addresses.json').mainnet

describe('Integration Tests', async () => {
  before(async () => {
    const signers = await ethers.getSigners()
    globalThis.signers = signers
  })

  beforeEach(async () => {
    const {
      routerContract,
      masterChefContract,
      token1Contract,
      token2Contract,
      token3Contract,
      masterChefV2Contract,
    } = await loadFixture(loadSushiSwapEcosystemFixture)
    const token4Contract = new ethers.Contract(
      ALCX,
      ercAbi,
      globalThis.signers[0]
    )

    globalThis.routerContract = routerContract
    globalThis.masterChefContract = masterChefContract
    globalThis.token1Contract = token1Contract
    globalThis.token2Contract = token2Contract
    globalThis.token3Contract = token3Contract
    globalThis.token4Contract = token4Contract
    globalThis.masterChefV2Contract = masterChefV2Contract

    await globalThis.token1Contract.deposit({
      value: ethers.utils.parseEther('600'),
    })

    await globalThis.token1Contract.approve(
      ROUTER,
      ethers.utils.parseEther('200')
    )
    await globalThis.routerContract.swapExactTokensForTokens(
      ethers.utils.parseEther('100'),
      ethers.utils.parseEther('100'),
      [WETH, DAI],
      globalThis.signers[0].address,
      1991497568
    )

    await globalThis.routerContract.swapExactTokensForTokens(
      ethers.utils.parseEther('100'),
      ethers.utils.parseEther('100'),
      [WETH, ALCX],
      globalThis.signers[0].address,
      1991497568
    )
  })

  describe('SushiSwapWallet', async () => {
    beforeEach(async () => {
      const { walletContract } = await loadFixture(deployWalletFixture)
      globalThis.walletContract = walletContract

      await globalThis.token1Contract.approve(
        walletContract.address,
        ethers.utils.parseEther('100')
      )
      const value = await globalThis.token2Contract.balanceOf(
        globalThis.signers[0].address
      )
      const value2 = await globalThis.token4Contract.balanceOf(
        globalThis.signers[0].address
      )

      await globalThis.token2Contract.approve(walletContract.address, value)
      await globalThis.token4Contract.approve(walletContract.address, value2)
      walletContract.deposit(WETH, ethers.utils.parseEther('100'))
      walletContract.deposit(DAI, value)
      walletContract.deposit(ALCX, ethers.utils.parseEther('100'))
    })

    depositIT()
    executeIT()
    executeWithSLPTokenAddressIT()
  })

  describe('MetamorphicWalletFactory', async () => {
    beforeEach(async () => {
      const { walletFactory } = await loadFixture(deployWalletFactoryFixture)
      globalThis.walletFactory = walletFactory
    })

    walletActionIT()
  })
})
