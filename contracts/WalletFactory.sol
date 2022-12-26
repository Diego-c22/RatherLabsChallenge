//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract WalletFactory {
    event Deployed(address address_);

    /**
     * @notice Execute function to deploy contract executing sushiswap flow in predicted address.
     * @param bytecode Bytecode of smart contract to execute sushiswap flow concatenated with encoded
     *  constructor arguments
     * @dev This function use create2 opcode to deploy the contract in a address that could be predicted.
     *  The salt is calculated with the address of the sender making impossible to create a contract in this
     *  address if it is not deployed from this factory and triggered by the same sender.
     */
    function walletAction(bytes calldata bytecode) public {
        bytes memory implInitCode = bytecode;
        bytes32 salt = bytes32(uint256(uint160(msg.sender)) << 96);
        address addr;
        assembly {
            let encoded_data := add(0x20, implInitCode) // load initialization code.
            let encoded_size := mload(implInitCode) // load init code's length.
            addr := create2(0, encoded_data, encoded_size, salt)
        }
        emit Deployed(addr);
    }
}
