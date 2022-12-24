const { ethers } = require('hardhat')
const { expect } = require('chai')
const { AddressZero } = ethers.constants

exports.deposit = () => {
  context('#deposit', async () => {
    it('Should increase WalletContract ether balance.', async () => {
      const address = await globalThis.signers[0].getAddress()
      const value = ethers.BigNumber.from(10)
      await globalThis.walletContract.deposit(AddressZero, 0, { value })
      expect(
        await globalThis.walletContract.balances(address, AddressZero)
      ).to.be.equals(value)
    })

    it("Should increase user's custom token balance.", async () => {
      const address = await globalThis.signers[0].getAddress()
      const value = ethers.BigNumber.from(10)
      await globalThis.walletContract.deposit(
        globalThis.mockToken1.address,
        value
      )
      expect(
        await globalThis.walletContract.balances(
          address,
          globalThis.mockToken1.address
        )
      ).to.be.equals(value)
    })
  })
}
