const { ethers } = require('hardhat')
const { SLP } = require('../../../data/addresses.json').mainnet
const chai = require('chai')
const { smock } = require('@defi-wonderland/smock')
const { AddressZero } = ethers.constants
const { expect, assert } = chai
chai.use(smock.matchers)

exports.execute = () => {
  context('#execute', async () => {
    it("Should revert if user doesn't have enough balance", async () => {
      await expect(
        globalThis.walletContract.execute(
          globalThis.mockToken1.address,
          globalThis.mockToken2.address,
          10000,
          1000000,
          1,
          globalThis.signers[0].address
        )
      ).to.revertedWith('Insufficient balance.')
    })

    it("Should decrease user's token 1 balance", async () => {
      const address = await globalThis.signers[0].getAddress()
      const value = ethers.BigNumber.from(100)
      await globalThis.walletContract.deposit(
        globalThis.mockToken1.address,
        value
      )
      await globalThis.walletContract.deposit(
        globalThis.mockToken2.address,
        value
      )

      globalThis.mockToken3.balanceOf.returns(1000000000000)

      await globalThis.walletContract.execute(
        globalThis.mockToken1.address,
        globalThis.mockToken2.address,
        value,
        value,
        1,
        globalThis.signers[0].address
      )

      expect(
        await globalThis.walletContract.balances(
          address,
          globalThis.mockToken1.address
        )
      ).to.be.equals(0)
    })

    it("Should decrease user's token 2 balance", async () => {
      const address = await globalThis.signers[0].getAddress()
      const value = ethers.BigNumber.from(100)
      await globalThis.walletContract.deposit(
        globalThis.mockToken1.address,
        value
      )
      await globalThis.walletContract.deposit(
        globalThis.mockToken2.address,
        value
      )
      globalThis.mockToken3.balanceOf.returns(1000000000000)
      await globalThis.walletContract.execute(
        globalThis.mockToken1.address,
        globalThis.mockToken2.address,
        value,
        value,
        1,
        globalThis.signers[0].address
      )

      expect(
        await globalThis.walletContract.balances(
          address,
          globalThis.mockToken2.address
        )
      ).to.be.equals(0)
    })

    it('Should use MasterChef V1', async () => {
      const address = await globalThis.signers[0].getAddress()
      const value = ethers.BigNumber.from(100)
      await globalThis.walletContract.deposit(
        globalThis.mockToken1.address,
        value
      )
      await globalThis.walletContract.deposit(
        globalThis.mockToken2.address,
        value
      )
      globalThis.mockToken3.balanceOf.returns(1000000000000)
      await globalThis.walletContract.execute(
        globalThis.mockToken1.address,
        globalThis.mockToken2.address,
        value,
        value,
        1,
        AddressZero
      )

      expect(globalThis.mockMasterChef['deposit(uint256,uint256)']).to.be
        .calledOnce
    })

    it('Should use MasterChef V2', async () => {
      const address = await globalThis.signers[0].getAddress()
      const value = ethers.BigNumber.from(100)
      await globalThis.walletContract.deposit(
        globalThis.mockToken1.address,
        value
      )
      await globalThis.walletContract.deposit(
        globalThis.mockToken2.address,
        value
      )
      globalThis.mockToken3.balanceOf.returns(1000000000000)
      await globalThis.walletContract.execute(
        globalThis.mockToken1.address,
        globalThis.mockToken2.address,
        value,
        value,
        1,
        address
      )

      expect(globalThis.mockMasterChefV2['deposit(uint256,uint256,address)']).to
        .be.called
    })
  })
}
