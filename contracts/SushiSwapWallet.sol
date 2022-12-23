// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './interfaces/IMasterChef.sol';
import './interfaces/IUniswapV2Router02.sol';
import './libraries/UniswapV2Library.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract SushiSwapWallet {
    address private constant ROUTER =
        0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F;
    address private constant MASTER_CHEF =
        0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd;
    address private constant MASTER_CHEF_V2 =
        0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d;

    address private constant FACTORY =
        0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac;

    string private constant REVERT_INSUFFICIENT_BALANCE =
        'Insufficient balance.';

    mapping(address => mapping(address => uint256)) public balances;

    /**
     * @notice Allow add funds to user wallet.
     * @dev To use native currency set token_ as address(0).
     * @dev When native currency is used, amount_ is ignored and is taken msg.value.
     * @param token_ Address of token to deposit.
     * @param amount_ Amount of tokens to deposit.
     */
    function deposit(address token_, uint256 amount_) external payable {
        if (token_ != address(0))
            IERC20(token_).transferFrom(msg.sender, address(this), amount_);
        uint256 value = token_ == address(0) ? msg.value : amount_;

        // Overflow is unrealistic, we can use unchecked to save gas.
        unchecked {
            balances[msg.sender][token_] += value;
        }
    }

    /**
     * @notice Execute SushiSwap deposit SLP tokens flow.
     *  1. Approve token 1 to SushiSwapRouter contract.
     *  2. Approve token 2 to SushiSwapRouter contract.
     *  3. AddLiquidity to pool.
     *  4. Approve SLP token to MasterChef contract.
     *  5. Deposit tokens.
     * @dev If 'to' is different to address(0) it will be used MasterChefV2.
     * @param token1 Address of first token in the liquidity pool.
     * @param token2 Address of second token in the liquidity pool.
     * @param amount1 Amount of tokens desired for first token in the liquidity pool.
     * @param token1 Amount of tokens desired for second token in the liquidity pool.
     * @param pid PID of liquidity pool.
     * @param to Address to use as depositor
     */
    function execute(
        address token1,
        address token2,
        uint256 amount1,
        uint256 amount2,
        uint256 pid,
        address to
    ) external {
        _checkBalance(token1, amount1);
        _checkBalance(token2, amount2);

        // We can use unchecked to save gas because amounts have already been checked.
        unchecked {
            balances[msg.sender][token1] -= amount1;
            balances[msg.sender][token2] -= amount2;
        }

        _addLiquidity(token1, token2, amount1, amount2);

        address token = UniswapV2Library.pairFor(FACTORY, token1, token2);
        _deposit(token, pid, to);
    }

    /**
     * @notice Execute SushiSwap deposit SLP tokens flow.
     *      - Use this function when SLP token address is calculated off-chain to save gas.
     *  1. Approve token 1 to SushiSwapRouter contract.
     *  2. Approve token 2 to SushiSwapRouter contract.
     *  3. AddLiquidity to pool.
     *  4. Approve SLP token to MasterChef contract.
     *  5. Deposit tokens.
     * * @dev If 'to' is different to address(0) it will be used MasterChefV2.
     * @param token1 Address of first token in the liquidity pool.
     * @param token2 Address of second token in the liquidity pool.
     * @param amount1 Amount of tokens desired for first token in the liquidity pool.
     * @param token1 Amount of tokens desired for second token in the liquidity pool.
     * @param pid PID of liquidity pool.
     * @param token SLP token address.
     * @param to Address to use as depositor
     */
    function executeWithSLPTokenAddress(
        address token1,
        address token2,
        uint256 amount1,
        uint256 amount2,
        uint256 pid,
        address token,
        address to
    ) external {
        _checkBalance(token1, amount1);
        _checkBalance(token2, amount2);

        unchecked {
            balances[msg.sender][token1] -= amount1;
            balances[msg.sender][token2] -= amount2;
        }
        _addLiquidity(token1, token2, amount1, amount2);
        _deposit(token, pid, to);
    }

    /**
     * @notice Verify if user has enough balance.
     * @param token Address of token to check.
     * @param amount Minimum amount of tokens expected to own.
     */
    function _checkBalance(address token, uint256 amount) internal view {
        require(
            balances[msg.sender][token] >= amount,
            REVERT_INSUFFICIENT_BALANCE
        );
    }

    /**
     * @notice Add liquidity to SushiSwap liquidity pool.
     *  1. Approve token 1 to SushiSwapRouter contract.
     *  2. Approve token 2 to SushiSwapRouter contract.
     *  3. AddLiquidity to pool.
     * @param token1 Address of first token in the liquidity pool.
     * @param token2 Address of second token in the liquidity pool.
     * @param amount1 Amount of tokens desired for first token in the liquidity pool.
     * @param token1 Amount of tokens desired for second token in the liquidity pool.
     */
    function _addLiquidity(
        address token1,
        address token2,
        uint256 amount1,
        uint256 amount2
    ) internal {
        IERC20(token1).approve(ROUTER, amount1);
        IERC20(token2).approve(ROUTER, amount2);
        IUniswapV2Router02(ROUTER).addLiquidity(
            token1,
            token2,
            amount1,
            amount2,
            amount1 / 10,
            amount2 / 100,
            address(this),
            block.timestamp
        );
    }

    /**
     * @notice Deposit SLP tokens in SushiSwap MasterChef.
     *  1. Approve SLP token to MasterChef contract.
     *  2. Deposit tokens.
     * @param pid PID of liquidity pool.
     * @param token SLP token address
     */
    function _deposit(address token, uint256 pid, address to) internal {
        uint256 balance = IERC20(token).balanceOf(address(this));

        if (to != address(0)) {
            IERC20(token).approve(MASTER_CHEF_V2, balance);
            IMasterChef(MASTER_CHEF_V2).deposit(pid, balance, to);
            return;
        }
        IERC20(token).approve(MASTER_CHEF, balance);
        IMasterChef(MASTER_CHEF).deposit(pid, balance);
    }
}
