//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import 'hardhat/console.sol';

contract WalletFactory {
    event Deployed(address address_);

    function walletAction(bytes calldata bytecode) public {
        bytes memory implInitCode = bytecode;
        bytes32 salt = bytes32(uint256(uint160(msg.sender)) << 96);
        console.log('salt:');
        console.logBytes32(salt);
        address addr;
        assembly {
            let encoded_data := add(0x20, implInitCode) // load initialization code.
            let encoded_size := mload(implInitCode) // load init code's length.
            addr := create2(0, encoded_data, encoded_size, salt)
        }
        console.log('deploy:', addr);
        emit Deployed(addr);
    }
}
