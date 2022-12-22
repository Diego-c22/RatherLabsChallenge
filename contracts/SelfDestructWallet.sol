// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'hardhat/console.sol';

interface IERC20Short {
    function approve(address spender_, uint256 amount_) external;

    function balanceOf(address address_) external view returns (uint256);
}

interface IUniswapV2Router {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
}

interface IChef {
    function deposit(uint256 _pid, uint256 _amount, address _to) external;
}

contract SelfDestructWallet {
    address private constant ROUTER =
        0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F;
    address private constant MASTER_CHEF =
        0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d;

    address private constant FACTORY =
        0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac;

    /**
     * @notice Execute SushiSwap deposit SLP tokens flow and at the end is self destructed.
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
     * @param token SLP token address.
     * * @param to Address to use as depositor
     */
    constructor(
        address token1,
        address token2,
        uint256 amount1,
        uint256 amount2,
        uint256 pid,
        address token,
        address to
    ) {
        console.log('ADDRESS', address(this));
        IERC20Short(token1).approve(ROUTER, amount1);
        IERC20Short(token2).approve(ROUTER, amount2);
        console.log('Approved');
        IUniswapV2Router(ROUTER).addLiquidity(
            token1,
            token2,
            amount1,
            amount2,
            amount1 / 10,
            amount2 / 100,
            address(this),
            block.timestamp
        );
        console.log('Liquided');
        uint256 balance = IERC20Short(token).balanceOf(address(this));
        IERC20Short(token).approve(MASTER_CHEF, balance);
        console.log('approved');
        IChef(MASTER_CHEF).deposit(pid, balance, to);
        console.log('deposited');
        selfdestruct(payable(msg.sender));
    }
}
