// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaythosVault
 * @notice The non-custodial monetary ethos for autonomous agents on Base L2.
 * Enforces cryptographic daily spend caps, TTL expiries, and x402 settlement.
 */
contract PaythosVault is Ownable {
    using SafeERC20 for IERC20;

    // --- STRUCTS ---
    struct SessionPolicy {
        uint256 dailyLimit;         // Max tokens allowed to spend per 24h window
        uint256 spentToday;         // Amount spent in current 24h window
        uint256 lastResetTimestamp; // Start timestamp of the current 24h window
        uint256 expiresAt;          // Hard cutoff timestamp for this session
        bool isActive;              // Kill-switch status for this session
    }

    // --- STATE VARIABLES ---
    mapping(address => SessionPolicy) public sessions;

    uint256 public protocolFeeBps; // 100 = 1.00%, 20 = 0.20%
    address public treasury;
    uint256 public constant MAX_FEE_BPS = 500; // Hard cap at 5%

    // --- EVENTS ---
    event SessionCreated(address indexed agentKey, uint256 dailyLimit, uint256 expiresAt);
    event SessionRevoked(address indexed agentKey);
    event PaymentExecuted(
        address indexed agentKey,
        address indexed token,
        address indexed recipient,
        uint256 amount,
        uint256 feeDeducted
    );
    event FeeConfigUpdated(address indexed newTreasury, uint256 newFeeBps);
    event FundsWithdrawn(address indexed token, address indexed to, uint256 amount);

    // --- CUSTOM ERRORS ---
    error SessionNotActive();
    error SessionExpired();
    error DailyLimitExceeded(uint256 requested, uint256 remaining);
    error InvalidAddress();
    error FeeTooHigh();
    error ZeroAmount();

    constructor(address _treasury) Ownable(msg.sender) {
        if (_treasury == address(0)) revert InvalidAddress();
        treasury = _treasury;
        protocolFeeBps = 0; // Starts at 0% for ecosystem growth
    }

    // --- AGENT EXECUTION ---

    function executePayment(
        address token,
        address recipient,
        uint256 amount
    ) external {
        if (amount == 0) revert ZeroAmount();
        if (recipient == address(0)) revert InvalidAddress();

        SessionPolicy storage policy = sessions[msg.sender];

        if (!policy.isActive) revert SessionNotActive();
        if (block.timestamp > policy.expiresAt) revert SessionExpired();

        if (block.timestamp >= policy.lastResetTimestamp + 1 days) {
            policy.spentToday = 0;
            policy.lastResetTimestamp = block.timestamp;
        }

        if (policy.spentToday + amount > policy.dailyLimit) {
            uint256 remaining = policy.dailyLimit > policy.spentToday ? policy.dailyLimit - policy.spentToday : 0;
            revert DailyLimitExceeded(amount, remaining);
        }

        policy.spentToday += amount;

        uint256 fee = 0;
        if (protocolFeeBps > 0 && treasury != address(0)) {
            fee = (amount * protocolFeeBps) / 10000;
        }
        uint256 netAmount = amount - fee;

        IERC20(token).safeTransfer(recipient, netAmount);
        if (fee > 0) {
            IERC20(token).safeTransfer(treasury, fee);
        }

        emit PaymentExecuted(msg.sender, token, recipient, netAmount, fee);
    }

    // --- OWNER CONTROLS ---

    function createSession(
        address agentKey,
        uint256 dailyLimit,
        uint256 durationInSeconds
    ) external onlyOwner {
        if (agentKey == address(0)) revert InvalidAddress();
        if (dailyLimit == 0) revert ZeroAmount();

        sessions[agentKey] = SessionPolicy({
            dailyLimit: dailyLimit,
            spentToday: 0,
            lastResetTimestamp: block.timestamp,
            expiresAt: block.timestamp + durationInSeconds,
            isActive: true
        });

        emit SessionCreated(agentKey, dailyLimit, block.timestamp + durationInSeconds);
    }

    function revokeSession(address agentKey) external onlyOwner {
        sessions[agentKey].isActive = false;
        emit SessionRevoked(agentKey);
    }

    function withdraw(address token, address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert InvalidAddress();
        IERC20(token).safeTransfer(to, amount);
        emit FundsWithdrawn(token, to, amount);
    }

    function setFeeConfig(address _treasury, uint256 _feeBps) external onlyOwner {
        if (_treasury == address(0)) revert InvalidAddress();
        if (_feeBps > MAX_FEE_BPS) revert FeeTooHigh();

        treasury = _treasury;
        protocolFeeBps = _feeBps;

        emit FeeConfigUpdated(_treasury, _feeBps);
    }
}
