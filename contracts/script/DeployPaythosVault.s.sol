// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PaythosVault.sol";

contract DeployPaythosVault is Script {
    function run() external returns (PaythosVault vault) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address treasuryAddress = vm.envOr("TREASURY_ADDRESS", deployer);

        vm.startBroadcast(deployerPrivateKey);
        vault = new PaythosVault(treasuryAddress);
        vm.stopBroadcast();
    }
}
