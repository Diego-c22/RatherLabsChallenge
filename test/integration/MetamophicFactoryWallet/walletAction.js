const { ethers } = require('hardhat')
const { expect, assert } = require('chai')
const { SLP, WETH, DAI, ALCX } = require('../../../data/addresses.json').mainnet
const {
  getPID,
  calculateUniswapSLPAddress,
  getBytes32Address,
  getCreate2Address,
  getBytecodeWallet,
} = require('../../../utilities')

exports.walletActionIT = () => {
  context('#walletAction', async () => {
    it('Should increase deposited amount on MasterChef contract.', async () => {
      const slpAddress = calculateUniswapSLPAddress(
        globalThis.token1Contract.address,
        globalThis.token4Contract.address
      )

      const pid = getPID(slpAddress, 'data/LiquidityPoolsV2.json')

      const bytecode = getBytecodeWallet(
        globalThis.token1Contract.address,
        globalThis.token4Contract.address,
        pid,
        globalThis.signers[0].address
      )

      const amount = (
        await globalThis.masterChefContract.userInfo(
          pid,
          globalThis.signers[0].address
        )
      ).amount

      const predefinedAddress = getCreate2Address(
        globalThis.walletFactory.address,
        getBytes32Address(globalThis.signers[0].address),
        ethers.utils.keccak256(bytecode)
      )

      await globalThis.token1Contract.transfer(
        predefinedAddress,
        '1000000000000000'
      )
      await globalThis.token4Contract.transfer(
        predefinedAddress,
        '100000000000000000'
      )

      await globalThis.walletFactory.walletAction(bytecode)
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
