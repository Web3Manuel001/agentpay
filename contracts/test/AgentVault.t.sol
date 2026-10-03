// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgentVault.sol";
import "./mocks/MockUSDC.sol";

contract AgentVaultTest is Test {
    AgentVault public vault;
    MockUSDC public usdc;

    address public owner = address(1);
    address public agentKey = address(2);
    address public merchant = address(3);
    address public treasury = address(4);
    address public rogueAgent = address(5);

    uint256 public constant INITIAL_VAULT_BALANCE = 1000 * 1e6; // 1,000 USDC
    uint256 public constant DAILY_LIMIT = 50 * 1e6;              // 50 USDC daily limit
    uint256 public constant DURATION = 7 days;                   // 7 day session

    function setUp() public {
        vm.startPrank(owner);

        // Deploy tokens and vault
        usdc = new MockUSDC();
        vault = new AgentVault(treasury);

        // Fund vault with 1,000 USDC
        usdc.mint(address(vault), INITIAL_VAULT_BALANCE);

        // Authorize agent session key
        vault.createSession(agentKey, DAILY_LIMIT, DURATION);

        vm.stopPrank();
    }

    // 1. HAPPY PATH: Agent spends within limits
    function test_AgentCanExecutePayment() public {
        uint256 paymentAmount = 10 * 1e6; // 10 USDC

        vm.prank(agentKey);
        vault.executePayment(address(usdc), merchant, paymentAmount);

        // Assert balances
        assertEq(usdc.balanceOf(merchant), paymentAmount);
        assertEq(usdc.balanceOf(address(vault)), INITIAL_VAULT_BALANCE - paymentAmount);

        // Assert internal vault accounting
        (, uint256 spentToday,,,) = vault.sessions(agentKey);
        assertEq(spentToday, paymentAmount);
    }

    // 2. ATTACK VECTOR: Agent exceeds daily limit
    function test_RevertWhen_DailyLimitExceeded() public {
        uint256 illegalAmount = 60 * 1e6; // 60 USDC (Limit is 50)

        vm.prank(agentKey);
        vm.expectRevert(
            abi.encodeWithSelector(
                AgentVault.DailyLimitExceeded.selector,
                illegalAmount,
                DAILY_LIMIT
            )
        );
        vault.executePayment(address(usdc), merchant, illegalAmount);
    }

    // 3. ATTACK VECTOR: Session key has expired
    function test_RevertWhen_SessionExpired() public {
        // Fast-forward time by 8 days (past the 7-day duration)
        vm.warp(block.timestamp + 8 days);

        vm.prank(agentKey);
        vm.expectRevert(AgentVault.SessionExpired.selector);
        vault.executePayment(address(usdc), merchant, 10 * 1e6);
    }

    // 4. ATTACK VECTOR: Unauthorized address tries to spend
    function test_RevertWhen_UnauthorizedAgentCalls() public {
        vm.prank(rogueAgent);
        vm.expectRevert(AgentVault.SessionNotActive.selector);
        vault.executePayment(address(usdc), merchant, 10 * 1e6);
    }

    // 5. MONETIZATION CHECK: Protocol fee deduction
    function test_ProtocolFeeDeduction() public {
        vm.startPrank(owner);
        // Set protocol fee to 100 bps (1%)
        vault.setFeeConfig(treasury, 100);
        vm.stopPrank();

        uint256 paymentAmount = 100 * 1e6; // 100 USDC (Temporarily grant higher limit)
        vm.prank(owner);
        vault.createSession(agentKey, 200 * 1e6, DURATION);

        vm.prank(agentKey);
        vault.executePayment(address(usdc), merchant, paymentAmount);

        // 1% of 100 USDC = 1 USDC to Treasury; 99 USDC to Merchant
        assertEq(usdc.balanceOf(treasury), 1 * 1e6);
        assertEq(usdc.balanceOf(merchant), 99 * 1e6);
    }
}