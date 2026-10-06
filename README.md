# AgentPay 🛡️🤖

> **The Open, Non-Custodial x402 Settlement Protocol & Spend Guardrails for Autonomous AI Agents on Base.**

[![Network: Base](https://img.shields.io/badge/Network-Base_L2-blue.svg)](https://base.org)
[![Standard: x402 v2](https://img.shields.io/badge/Standard-x402_v2-emerald.svg)](https://x402.org)
[![Adapters: LangChain & ElizaOS](https://img.shields.io/badge/Adapters-LangChain_%7C_ElizaOS-purple.svg)](#framework-adapters)
[![Interface: Anthropic MCP](https://img.shields.io/badge/Interface-Anthropic_MCP-orange.svg)](https://modelcontextprotocol.io)
[![Contracts: Base Sepolia](https://img.shields.io/badge/Contracts-Verified_on_Basescan-black.svg)](https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg)](LICENSE)

---

## ⚡ The Problem

1. **The Meatspace Identity Wall:** Autonomous software has no legal identity (SSN, passport, physical address). Traditional payment rails (Stripe, Visa) cannot onboard autonomous agents without human KYC/KYB.
2. **The Micropayment Fee Crisis:** Traditional payment rails carry a minimum fixed fee of ~$0.30 + 2.9%. When an AI agent pays $0.005 for an API call, traditional transaction fees exceed 6,000%.
3. **The Prompt Injection Threat:** Providing an autonomous LLM with a master crypto private key risks 100% treasury drain if the agent encounters adversarial prompts or runaway execution loops.

---

## 💡 The Solution: AgentPay

AgentPay provides the native financial operating system for the machine-to-machine economy:

* 🔐 **Non-Custodial Session Vaults (`AgentVault.sol`):** Cryptographically enforce daily spend allowances, time-to-live expiries, and whitelisted destinations directly on Base Layer 2.
* 🌐 **Official x402 v2 Implementation:** Natively complies with the Linux Foundation and Base HTTP 402 specifications (`PAYMENT-REQUIRED` ➔ `PAYMENT-SIGNATURE` ➔ `PAYMENT-RESPONSE`).
* 🔌 **Universal Framework Adapters:** Native plugins for **LangChain**, **ElizaOS (ai16z)**, and **Anthropic Model Context Protocol (MCP)**.
* 🏃 **Reference Errand Agent (Gofer):** An autonomous multi-tool agent powered by Qwen 3.8 on Groq LPUs, featuring Base token tracking, DefiLlama metrics, and Aerodrome DEX swap staging.

---

## 📜 Verified On-Chain Deployments (Base Sepolia)

| Contract | Address | Network | Explorer |
| :--- | :--- | :--- | :--- |
| **AgentVault Core** | `0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347` | Base Sepolia (`84532`) | [View on Basescan](https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347) |
| **Deployment Tx** | `0x3d50d610088a53bb26e13329b8c37c2d5c120bbfb8a3824d7c4adc0199e9acdc` | Base Sepolia (`84532`) | [View Tx Hash](https://sepolia.basescan.org/tx/0x3d50d610088a53bb26e13329b8c37c2d5c120bbfb8a3824d7c4adc0199e9acdc) |

---

## 🏛️ Architecture
┌────────────────────────────────────────────────────────┐
│ AI Agent Runtimes (LangChain, ElizaOS, Claude, Grok) │
│ - Holds ephemeral restricted session key (low risk) │
└──────────────────────────┬─────────────────────────────┘
│ Viem / EIP-712
▼
┌────────────────────────────────────────────────────────┐
│ AgentPay SDK (@agentpay/sdk) │
│ - Handles x402 v2 negotiation, token tracking │
└──────────────────────────┬─────────────────────────────┘
│ Submits Transaction
▼
┌────────────────────────────────────────────────────────┐
│ On-Chain Protocol: AgentVault.sol (Base L2) │
│ - Enforces: dailyLimit, spentToday, expiresAt │
│ - Settles instant micro-payments with 0.20% fee │
└────────────────────────────────────────────────────────┘
code
Code
---

## 🚀 Quickstart

### 1. Installation

```bash
npm install @agentpay/sdk viem
2. Autonomous x402 Fetch (For Agent Developers)
code
TypeScript
import { AgentPay } from '@agentpay/sdk';

// Initialize with ephemeral restricted session key
const agent = new AgentPay({
  privateKey: process.env.AGENT_SESSION_KEY,
  vaultAddress: '0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347', // Base Sepolia
  rpcUrl: 'https://sepolia.base.org',
});

// Automatically catches HTTP 402, settles on Base, and returns data
const { data, costPaid, txHash } = await agent.fetchWithPayment(
  'https://api.marketdata.eth/v1/alpha'
);

console.log(`Unlocked data for $${costPaid} USDC. Tx: ${txHash}`);
3. x402 Server Middleware (For API Creators)
code
TypeScript
import { createX402Paywall } from '@agentpay/sdk/middleware';
import http from 'http';

const paywall = createX402Paywall({
  costUsdc: '0.10',
  recipient: '0x_your_treasury_address',
  tokenAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
  networkId: 'eip155:84532',
});

const server = http.createServer((req, res) => {
  paywall(req, res, () => {
    res.end(JSON.stringify({ premiumData: 'Confidential intelligence unlocked.' }));
  });
});

server.listen(4000);
🔌 Framework Adapters
LangChain Native Tools
code
TypeScript
import { createLangChainTools } from '@agentpay/sdk';

const tools = createLangChainTools(agentPayClient, USDC_ADDRESS);
// Exposes: agentpay_check_budget, agentpay_execute_payment, agentpay_fetch_x402
ElizaOS (ai16z) Plugin
code
TypeScript
import { createAgentPayElizaPlugin } from '@agentpay/sdk';

const plugin = createAgentPayElizaPlugin(agentPayClient, USDC_ADDRESS);
// Registers AGENTPAY_SETTLE_PAYMENT, AGENTPAY_X402_FETCH, and live budget state providers
Anthropic Model Context Protocol (MCP)
code
JSON
{
  "mcpServers": {
    "agentpay": {
      "command": "node",
      "args": ["node_modules/@agentpay/sdk/dist/mcp.js"],
      "env": {
        "AGENTPAY_VAULT_ADDRESS": "0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347",
        "AGENTPAY_AGENT_KEY": "0x_your_agent_session_key"
      }
    }
  }
}
📂 Repository Structure
code
Code
agentpay/
├── contracts/          # Foundry project
│   ├── src/            # AgentVault.sol (On-chain protocol)
│   ├── test/           # 5/5 passing unit tests
│   └── script/         # Base Sepolia deployment automation
├── sdk/                # @agentpay/sdk package
│   ├── src/            # Modular TypeScript engine (Viem)
│   │   ├── adapters/   # LangChain & ElizaOS native plugins
│   │   ├── brain/      # Autonomous Qwen 3.8 tool runner & blueprints
│   │   └── tools/      # Base tokens, DefiLlama, gas, payments, swaps
│   └── examples/       # Gofer reference agent & multi-vendor tests
├── web/                # Next.js App Router (Turbopack)
│   ├── app/            # Protocol Hub (/) & Gofer Errand Desk (/gofer)
│   └── components/     # Native shadcn/ui Zinc components
└── README.md
📜 License
MIT License. Built for the open machine economy on Base.

---

## ⚡ 1-Click Host Installation (Claude Code & Cursor)

Install the CLI and auto-detect your AI editor environments (Cursor & Claude Desktop) in one command:

```bash
curl -fsSL https://raw.githubusercontent.com/Web3Manuel001/agentpay/main/install.sh | bash
🛡️ Enterprise Policy Sets & Verifiable Intent
AgentPay implements a 3-tier safety threshold model with cryptographic intent attribution:
code
TypeScript
import { PolicyEngine } from 'agentpay';

const policy = new PolicyEngine({
  maxPerTransactionUsdc: 2.00,   // Sub-$2 auto-executes via x402
  dailyCapUsdc: 20.00,           // Hard daily ceiling
  approvalThresholdUsdc: 5.00,   // $5+ pauses and triggers Human-in-the-Loop approval
  destinationAllowlist: ['0x...'] // Only approved contracts
});

// Attaches cryptographic proof of the user's prompt to the on-chain receipt
const attestation = policy.generateIntentAttestation("Audit Base liquidity");
