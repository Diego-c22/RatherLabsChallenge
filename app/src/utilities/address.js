import { ethers } from 'ethers'
const FACTORY = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'

export const calculateUniswapSLPAddress = (token1, token2) => {
  const [t1, t2] = token1 < token2 ? [token1, token2] : [token2, token1]
  const packed = ethers.utils.solidityPack(['address', 'address'], [t1, t2])
  const address = getCreate2Address(
    FACTORY,
    ethers.utils.keccak256(packed),
    '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303'
  )
  return address
}

export const getCreate2Address = (from, salt, bytecode) => {
  return ethers.utils.getCreate2Address(from, salt, bytecode)
}
