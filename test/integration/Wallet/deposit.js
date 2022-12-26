const { ethers } = require('hardhat')
const { expect, assert } = require('chai')
const { AddressZero } = ethers.constants

exports.depositIT = () => {
  context('#deposit', async () => {
    it('Should increase SushiSwapWallet ERC20 balance.', async () => {
      const value = ethers.BigNumber.from(10)

      await globalThis.token1Contract.approve(
        globalThis.walletContract.address,
        value
      )

      const balance = await globalThis.token1Contract.balanceOf(
        walletContract.address
      )

      await globalThis.walletContract.deposit(
        globalThis.token1Contract.address,
        value
      )

      expect(
        await globalThis.token1Contract.balanceOf(walletContract.address)
      ).to.be.equals(balance.add(value))
    })

    it('Should increase SushiSwapWallet ether balance.', async () => {
      const value = ethers.BigNumber.from(10)
      const contract = globalThis.walletContract
      const address = contract.address
      const balance = await contract.provider.getBalance(address)
      await contract.deposit(AddressZero, 0, { value })
      expect(await contract.provider.getBalance(address)).to.be.equals(
        value.add(balance)
      )
    })
  })
}
