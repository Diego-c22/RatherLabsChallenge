const { ethers } = require('hardhat')
const { expect, assert } = require('chai')
const { getPID, calculateUniswapSLPAddress } = require('../../../utilities')
const { AddressZero } = ethers.constants

exports.executeWithSLPTokenAddressIT = () => {
  context('#executeWitSLPTokenAddress', async () => {
    it('Should increase deposited amount on MasterChef contract.', async () => {
      const contract = globalThis.walletContract
      const slpAddress = calculateUniswapSLPAddress(
        globalThis.token1Contract.address,
        globalThis.token2Contract.address
      )
      const pid = getPID(slpAddress, 'data/LiquidityPoolsV1.json')
      const amount = (
        await globalThis.masterChefContract.userInfo(pid, contract.address)
      ).amount
      await contract.executeWithSLPTokenAddress(
        globalThis.token1Contract.address,
        globalThis.token2Contract.address,
        '1000000000000',
        '10000000000000000',
        pid,
        slpAddress,
        AddressZero
      )

      expect(
        (await globalThis.masterChefContract.userInfo(pid, contract.address))
          .amount
      ).to.be.greaterThan(amount)
    })

    it('Should increase deposited amount on MasterChefV2 contract.', async () => {
      const contract = globalThis.walletContract
      const slpAddress = calculateUniswapSLPAddress(
        globalThis.token1Contract.address,
        globalThis.token4Contract.address
      )
      const pid = getPID(slpAddress, 'data/LiquidityPoolsV2.json')
      const amount = (
        await globalThis.masterChefContract.userInfo(pid, contract.address)
      ).amount
      await contract.executeWithSLPTokenAddress(
        globalThis.token1Contract.address,
        globalThis.token4Contract.address,
        '1000000000000000000',
        '80000000000000000000',
        pid,
        slpAddress,
        globalThis.signers[0].address
      )

      expect(
        (
          await globalThis.masterChefV2Contract.userInfo(
            pid,
            globalThis.signers[0].address
          )
        ).amount
      ).to.be.greaterThan(amount)
    })
  })
}
