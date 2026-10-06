// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PaythosVault.sol";
import "./mocks/MockUSDC.sol";

contract PaythosVaultTest is Test {
    PaythosVault public vault;
    MockUSDC public usdc;

    address public owner = address(1);
    address public agentKey = address(2);
    address public merchant = address(3);
    address public treasury = address(4);

    uint256 public constant INITIAL_BALANCE = 1000 * 1e6;
    uint256 public constant DAILY_LIMIT = 50 * 1e6;
    uint256 public constant DURATION = 7 days;

    function setUp() public {
        vm.startPrank(owner);
        usdc = new MockUSDC();
        vault = new PaythosVault(treasury);
        usdc.mint(address(vault), INITIAL_BALANCE);
        vault.createSession(agentKey, DAILY_LIMIT, DURATION);
        vm.stopPrank();
    }

    function test_AgentCanExecutePayment() public {
        uint256 amount = 10 * 1e6;
        vm.prank(agentKey);
        vault.executePayment(address(usdc), merchant, amount);

        assertEq(usdc.balanceOf(merchant), amount);
        (, uint256 spentToday,,,) = vault.sessions(agentKey);
        assertEq(spentToday, amount);
    }

    function test_RevertWhen_DailyLimitExceeded() public {
        uint256 illegal = 60 * 1e6;
        vm.prank(agentKey);
        vm.expectRevert(
            abi.encodeWithSelector(
                PaythosVault.DailyLimitExceeded.selector,
                illegal,
                DAILY_LIMIT
            )
        );
        vault.executePayment(address(usdc), merchant, illegal);
    }

    function test_RevertWhen_SessionExpired() public {
        vm.warp(block.timestamp + 8 days);
        vm.prank(agentKey);
        vm.expectRevert(PaythosVault.SessionExpired.selector);
        vault.executePayment(address(usdc), merchant, 10 * 1e6);
    }

    function test_ProtocolFeeDeduction() public {
        vm.startPrank(owner);
        vault.setFeeConfig(treasury, 100); // 1% fee
        vault.createSession(agentKey, 200 * 1e6, DURATION);
        vm.stopPrank();

        vm.prank(agentKey);
        vault.executePayment(address(usdc), merchant, 100 * 1e6);

        assertEq(usdc.balanceOf(treasury), 1 * 1e6);
        assertEq(usdc.balanceOf(merchant), 99 * 1e6);
    }
}
