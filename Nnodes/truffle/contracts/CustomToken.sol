pragma solidity 0.4.19;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract CustomToken is MintableToken {
    address[] public tokenHolders;
    string public name = "Custom Token";
    string public symbol = "CTT";
    uint8 public decimals = 18;
    uint256 initialSupply = 10000e18;
}