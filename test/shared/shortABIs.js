const ercAbi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function deposit() public payable',
  'function approve(address spender, uint256 amount) returns (bool)',
]

module.exports = { ercAbi }
