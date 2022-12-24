const { ethers } = require('hardhat')
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const {
  deployWalletFixture,
  deploySushiSwapEcosystemFixture,
  deploySelfDestructWalletFixture,
  deployWalletFactoryFixture,
} = require('../shared/Fixtures')
const { deposit } = require('./Wallet/deposit')
const { execute } = require('./Wallet/execute')
const {
  executeWithSLPTokenAddress,
} = require('./Wallet/executeWithSLPTokenAddress')
const { constructorContract } = require('./SelfDestructWallet/constructor')
const { walletAction } = require('./MetamorphicFactoryWallet/walletAction')

describe('Unit Tests', async () => {
  before(async () => {
    const signers = await ethers.getSigners()
    globalThis.signers = signers
  })

  beforeEach(async () => {
    const {
      mockRouter,
      mockMasterChef,
      mockToken1,
      mockToken2,
      mockToken3,
      mockMasterChefV2,
    } = await loadFixture(deploySushiSwapEcosystemFixture)

    globalThis.mockRouter = mockRouter
    globalThis.mockMasterChef = mockMasterChef
    globalThis.mockToken1 = mockToken1
    globalThis.mockToken2 = mockToken2
    globalThis.mockToken3 = mockToken3
    globalThis.mockMasterChefV2 = mockMasterChefV2
  })

  describe('SushiSwapWallet', async () => {
    beforeEach(async () => {
      const { walletContract } = await loadFixture(deployWalletFixture)
      globalThis.walletContract = walletContract
    })

    deposit()
    execute()
    executeWithSLPTokenAddress()
  })

  describe('SelfDestructWallet', async () => {
    constructorContract()
  })

  describe('MetamorphicWalletFactory', async () => {
    beforeEach(async () => {
      const { walletFactory } = await loadFixture(deployWalletFactoryFixture)
      globalThis.walletFactory = walletFactory
    })

    walletAction()
  })
})
