// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

interface IMasterChef {
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
    }

    struct PoolInfo {
        address lpToken; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. SUSHI to distribute per block.
        uint256 lastRewardBlock; // Last block number that SUSHI distribution occurs.
        uint256 accSushiPerShare; // Accumulated SUSHI per share, times 1e12. See below.
    }

    function totalAllocPoint() external view returns (uint256);

    function deposit(uint256 _pid, uint256 _amount) external;

    function deposit(uint256 _pid, uint256 _amount, address _to) external;

    function poolLength() external view returns (uint256);

    function lpToken(uint256) external view returns (address);

    function userInfo(
        uint256 _pid,
        address _user
    ) external view returns (UserInfo memory);

    function poolInfo(
        uint256 pid
    ) external view returns (IMasterChef.PoolInfo memory);
}
