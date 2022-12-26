# Solidity API

## WalletFactory

### Deployed

```solidity
event Deployed(address address_)
```

### walletAction

```solidity
function walletAction(bytes bytecode) public
```

Execute function to deploy contract executing sushiswap flow in predicted address.

_This function use create2 opcode to deploy the contract in a address that could be predicted.
 The salt is calculated with the address of the sender making impossible to create a contract in this
 address if it is not deployed from this factory and triggered by the same sender._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| bytecode | bytes | Bytecode of smart contract to execute sushiswap flow concatenated with encoded  constructor arguments |

## InsufficientBalance

```solidity
error InsufficientBalance()
```

## SushiSwapWallet

### ROUTER

```solidity
address ROUTER
```

### MASTER_CHEF

```solidity
address MASTER_CHEF
```

### MASTER_CHEF_V2

```solidity
address MASTER_CHEF_V2
```

### FACTORY

```solidity
address FACTORY
```

### balances

```solidity
mapping(address => mapping(address => uint256)) balances
```

### deposit

```solidity
function deposit(address token_, uint256 amount_) external payable
```

Allow add funds to user wallet.

_To use native currency set token_ as address(0).
When native currency is used, amount_ is ignored and is taken msg.value._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token_ | address | Address of token to deposit. |
| amount_ | uint256 | Amount of tokens to deposit. |

### execute

```solidity
function execute(address token1, address token2, uint256 amount1, uint256 amount2, uint256 pid, address to) external
```

Execute SushiSwap deposit SLP tokens flow.
 1. Approve token 1 to SushiSwapRouter contract.
 2. Approve token 2 to SushiSwapRouter contract.
 3. AddLiquidity to pool.
 4. Approve SLP token to MasterChef contract.
 5. Deposit tokens.

_If 'to' is different to address(0) it will be used MasterChefV2._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token1 | address | Address of first token in the liquidity pool. |
| token2 | address | Address of second token in the liquidity pool. |
| amount1 | uint256 | Amount of tokens desired for first token in the liquidity pool. |
| amount2 | uint256 |  |
| pid | uint256 | PID of liquidity pool. |
| to | address | Address to use as depositor |

### executeWithSLPTokenAddress

```solidity
function executeWithSLPTokenAddress(address token1, address token2, uint256 amount1, uint256 amount2, uint256 pid, address token, address to) external
```

Execute SushiSwap deposit SLP tokens flow.
     - Use this function when SLP token address is calculated off-chain to save gas.
 1. Approve token 1 to SushiSwapRouter contract.
 2. Approve token 2 to SushiSwapRouter contract.
 3. AddLiquidity to pool.
 4. Approve SLP token to MasterChef contract.
 5. Deposit tokens.
* @dev If 'to' is different to address(0) it will be used MasterChefV2.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token1 | address | Address of first token in the liquidity pool. |
| token2 | address | Address of second token in the liquidity pool. |
| amount1 | uint256 | Amount of tokens desired for first token in the liquidity pool. |
| amount2 | uint256 |  |
| pid | uint256 | PID of liquidity pool. |
| token | address | SLP token address. |
| to | address | Address to use as depositor |

### _checkBalance

```solidity
function _checkBalance(address token, uint256 amount) internal view
```

Verify if user has enough balance.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | Address of token to check. |
| amount | uint256 | Minimum amount of tokens expected to own. |

### _addLiquidity

```solidity
function _addLiquidity(address token1, address token2, uint256 amount1, uint256 amount2) internal
```

Add liquidity to SushiSwap liquidity pool.
 1. Approve token 1 to SushiSwapRouter contract.
 2. Approve token 2 to SushiSwapRouter contract.
 3. AddLiquidity to pool.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token1 | address | Address of first token in the liquidity pool. |
| token2 | address | Address of second token in the liquidity pool. |
| amount1 | uint256 | Amount of tokens desired for first token in the liquidity pool. |
| amount2 | uint256 |  |

### _deposit

```solidity
function _deposit(address token, uint256 pid, address to) internal
```

Deposit SLP tokens in SushiSwap MasterChef.
 1. Approve SLP token to MasterChef contract.
 2. Deposit tokens.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | SLP token address |
| pid | uint256 | PID of liquidity pool. |
| to | address |  |

## IMasterChef

### UserInfo

```solidity
struct UserInfo {
  uint256 amount;
  uint256 rewardDebt;
}
```

### PoolInfo

```solidity
struct PoolInfo {
  address lpToken;
  uint256 allocPoint;
  uint256 lastRewardBlock;
  uint256 accSushiPerShare;
}
```

### totalAllocPoint

```solidity
function totalAllocPoint() external view returns (uint256)
```

### deposit

```solidity
function deposit(uint256 _pid, uint256 _amount) external
```

### deposit

```solidity
function deposit(uint256 _pid, uint256 _amount, address _to) external
```

### poolLength

```solidity
function poolLength() external view returns (uint256)
```

### lpToken

```solidity
function lpToken(uint256) external view returns (address)
```

### userInfo

```solidity
function userInfo(uint256 _pid, address _user) external view returns (struct IMasterChef.UserInfo)
```

### poolInfo

```solidity
function poolInfo(uint256 pid) external view returns (struct IMasterChef.PoolInfo)
```

## IUniswapV2Router01

### factory

```solidity
function factory() external pure returns (address)
```

### WETH

```solidity
function WETH() external pure returns (address)
```

### addLiquidity

```solidity
function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)
```

### addLiquidityETH

```solidity
function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)
```

### removeLiquidity

```solidity
function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external returns (uint256 amountA, uint256 amountB)
```

### removeLiquidityETH

```solidity
function removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external returns (uint256 amountToken, uint256 amountETH)
```

### removeLiquidityWithPermit

```solidity
function removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint256 amountA, uint256 amountB)
```

### removeLiquidityETHWithPermit

```solidity
function removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint256 amountToken, uint256 amountETH)
```

### swapExactTokensForTokens

```solidity
function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)
```

### swapTokensForExactTokens

```solidity
function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)
```

### swapExactETHForTokens

```solidity
function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) external payable returns (uint256[] amounts)
```

### swapTokensForExactETH

```solidity
function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)
```

### swapExactTokensForETH

```solidity
function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)
```

### swapETHForExactTokens

```solidity
function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) external payable returns (uint256[] amounts)
```

### quote

```solidity
function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) external pure returns (uint256 amountB)
```

### getAmountOut

```solidity
function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) external pure returns (uint256 amountOut)
```

### getAmountIn

```solidity
function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut) external pure returns (uint256 amountIn)
```

### getAmountsOut

```solidity
function getAmountsOut(uint256 amountIn, address[] path) external view returns (uint256[] amounts)
```

### getAmountsIn

```solidity
function getAmountsIn(uint256 amountOut, address[] path) external view returns (uint256[] amounts)
```

## IUniswapV2Router02

### removeLiquidityETHSupportingFeeOnTransferTokens

```solidity
function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external returns (uint256 amountETH)
```

### removeLiquidityETHWithPermitSupportingFeeOnTransferTokens

```solidity
function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint256 amountETH)
```

### swapExactTokensForTokensSupportingFeeOnTransferTokens

```solidity
function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external
```

### swapExactETHForTokensSupportingFeeOnTransferTokens

```solidity
function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) external payable
```

### swapExactTokensForETHSupportingFeeOnTransferTokens

```solidity
function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external
```

## UniswapV2Library

### sortTokens

```solidity
function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1)
```

### pairFor

```solidity
function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair)
```

## IERC20Short

### approve

```solidity
function approve(address spender_, uint256 amount_) external
```

### balanceOf

```solidity
function balanceOf(address address_) external view returns (uint256)
```

## IUniswapV2Router

### addLiquidity

```solidity
function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external returns (uint256 amountA, uint256 amountB, uint256 liquidity)
```

## IChef

### deposit

```solidity
function deposit(uint256 _pid, uint256 _amount, address _to) external
```

## SelfDestructWallet

### ROUTER

```solidity
address ROUTER
```

### MASTER_CHEF

```solidity
address MASTER_CHEF
```

### FACTORY

```solidity
address FACTORY
```

### constructor

```solidity
constructor(address token1, address token2, uint256 pid, address token, address to) public
```

Execute SushiSwap deposit SLP tokens flow and at the end is self destructed.
 1. Approve token 1 to SushiSwapRouter contract.
 2. Approve token 2 to SushiSwapRouter contract.
 3. AddLiquidity to pool.
 4. Approve SLP token to MasterChef contract.
 5. Deposit tokens.

_If 'to' is different to address(0) it will be used MasterChefV2._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token1 | address | Address of first token in the liquidity pool. |
| token2 | address | Address of second token in the liquidity pool. |
| pid | uint256 | PID of liquidity pool. |
| token | address | SLP token address. |
| to | address | Address to use as depositor |

## Token

### constructor

```solidity
constructor(string _name, string _symbol) public
```

