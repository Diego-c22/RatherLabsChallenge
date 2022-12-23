const { ethers } = require('hardhat')
const { SLP, WETH, DAI } = require('../../../data/addresses.json').mainnet
const chai = require('chai')
const { smock } = require('@defi-wonderland/smock')
const {
  getFunctionBytecode,
  getBytecodeWallet,
  getCreate2Address,
  getBytes32Address,
} = require('../../../utilities')
const { AddressZero } = ethers.constants
const { expect, assert } = chai

const {
  bytecode,
} = require('../../../artifacts/contracts/SelfDestructWallet.sol/SelfDestructWallet.json')

exports.walletAction = () => {
  context('#walletAction', async () => {
    it('Should deploy contract in predefined address.', async () => {
      const bytecode = getBytecodeWallet(
        WETH,
        DAI,
        1,
        globalThis.signers[0].address
      )

      const predefinedAddress = getCreate2Address(
        globalThis.walletFactory.address,
        getBytes32Address(globalThis.signers[0].address),
        ethers.utils.keccak256(bytecode)
      )

      await expect(globalThis.walletFactory.walletAction(bytecode))
        .to.emit(globalThis.walletFactory, 'Deployed')
        .withArgs(predefinedAddress)
    })

    it('Should emit event containing the wallet address.', async () => {
      const bytecode = getBytecodeWallet(
        WETH,
        DAI,
        1,
        globalThis.signers[0].address
      )

      const predefinedAddress = getCreate2Address(
        globalThis.walletFactory.address,
        getBytes32Address(globalThis.signers[0].address),
        ethers.utils.keccak256(bytecode)
      )

      await expect(globalThis.walletFactory.walletAction(bytecode)).to.emit(
        globalThis.walletFactory,
        'Deployed'
      )
    })

    it('Should be self-destroyed after complete flow.', async () => {
      const bytecode = getBytecodeWallet(
        WETH,
        DAI,
        1,
        globalThis.signers[0].address
      )

      const predefinedAddress = getCreate2Address(
        globalThis.walletFactory.address,
        getBytes32Address(globalThis.signers[0].address),
        ethers.utils.keccak256(bytecode)
      )

      await globalThis.walletFactory.walletAction(bytecode)

      expect(await ethers.provider.getCode(predefinedAddress)).to.be.equals(
        '0x'
      )
    })
  })
}
