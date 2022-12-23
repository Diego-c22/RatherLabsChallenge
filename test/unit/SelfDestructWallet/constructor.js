const { ethers } = require('hardhat')
const chai = require('chai')
const { smock } = require('@defi-wonderland/smock')
const { AddressZero } = ethers.constants
const { expect, assert } = chai
const { SLP } = require('../../../data/addresses.json').mainnet

exports.constructorContract = () => {
  context('#constructor', async () => {
    it('Should finish SushiSwap flow with no errors', async () => {
      const address = await globalThis.signers[0].getAddress()
      globalThis.mockToken3.balanceOf.returns(1000000000000)
      const selfDestructWallet = await ethers.getContractFactory(
        'SelfDestructWallet'
      )

      await expect(
        selfDestructWallet.deploy(
          globalThis.mockToken1.address,
          globalThis.mockToken2.address,
          1,
          SLP,
          address
        )
      ).to.not.reverted
    })

    it('Should destroy itself at end', async () => {
      const address = await globalThis.signers[0].getAddress()
      const value = ethers.BigNumber.from(100)
      globalThis.mockToken3.balanceOf.returns(1000000000000)

      let selfDestructWallet = await ethers.getContractFactory(
        'SelfDestructWallet'
      )

      selfDestructWallet = await selfDestructWallet.deploy(
        globalThis.mockToken1.address,
        globalThis.mockToken2.address,
        1,
        SLP,
        address
      )

      const addressWallet = selfDestructWallet.address

      expect(await ethers.provider.getCode(addressWallet)).to.be.equals('0x')
    })
  })
}
