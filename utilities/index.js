const fs = require('fs')
const { FACTORY } = require('../data/addresses.json').mainnet

const {
  bytecode: walletBytecode,
} = require('../artifacts/contracts/SelfDestructWallet.sol/SelfDestructWallet.json')

const getFunctionBytecode = (parameters) => {
  const parametersEncoded = ethers.utils.defaultAbiCoder.encode(
    [
      'address',
      'address',
      'uint256',
      'uint256',
      'uint256',
      'address',
      'address',
    ],
    parameters
  )

  const functionSig = ethers.utils
    .id('execute(address,address,uint256,uint256,uint256,address,address)')
    .substring(0, 10)

  const funExe = functionSig + parametersEncoded.substring(2)

  return funExe
}

const getCreate2Address = (from, salt, bytecode) => {
  return ethers.utils.getCreate2Address(from, salt, bytecode)
}

const getBytecodeWallet = (token1, token2, pid, to) => {
  const tokenSLP = calculateUniswapSLPAddress(token1, token2)
  const parameters = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'address', 'address'],
    [token1, token2, pid, tokenSLP, to]
  )

  return walletBytecode + parameters.substring(2)
}

const calculateUniswapSLPAddress = (token1, token2) => {
  const [t1, t2] = token1 < token2 ? [token1, token2] : [token2, token1]
  const packed = ethers.utils.solidityPack(['address', 'address'], [t1, t2])
  const address = getCreate2Address(
    FACTORY,
    ethers.utils.keccak256(packed),
    '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303'
  )
  return address
}

const getBytes32Address = (address) => {
  for (i = address.length; i < 66; i++) {
    address += '0'
  }
  return address
}

const getPID = (address, file) => {
  const data = fs.readFileSync(file, (err) => {
    if (err) console.log(err)
  })
  const dataParsed = JSON.parse(data)
  for (i = 0; i < dataParsed.length; i++) {
    if (address.toUpperCase() === dataParsed[i].address.toUpperCase())
      return dataParsed[i].pid
  }
  return dataParsed.length
}
module.exports = {
  getFunctionBytecode,
  getBytecodeWallet,
  getBytes32Address,
  getCreate2Address,
  getPID,
  calculateUniswapSLPAddress,
}
