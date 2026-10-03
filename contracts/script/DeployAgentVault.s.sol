// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AgentVault.sol";
import "../test/mocks/MockUSDC.sol";

contract DeployAgentVault is Script {
    function run() external returns (AgentVault vault, MockUSDC usdc) {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );

        address deployer = vm.addr(deployerPrivateKey);
        address treasuryAddress = vm.envOr("TREASURY_ADDRESS", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC
        usdc = new MockUSDC();

        // 2. Deploy Vault
        vault = new AgentVault(treasuryAddress);

        // 3. Pre-fund the vault with 50,000 USDC
        usdc.mint(address(vault), 50_000 * 1e6);

        vm.stopBroadcast();

        console.log("-----------------------------------------");
        console.log("AgentVault  :", address(vault));
        console.log("MockUSDC    :", address(usdc));
        console.log("Vault funded with 50,000 USDC!");
        console.log("-----------------------------------------");
    }
}