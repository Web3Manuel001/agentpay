# AgentPay 🛡️🤖

> **The Open, Non-Custodial x402 Settlement Protocol & Spend Guardrails for Autonomous AI Agents on Base.**

[![Network: Base](https://img.shields.io/badge/Network-Base-blue.svg)](https://base.org)
[![Standard: x402 v2](https://img.shields.io/badge/Standard-x402_v2-green.svg)](https://x402.org)
[![Interface: Anthropic MCP](https://img.shields.io/badge/Interface-Anthropic_MCP-purple.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

---

## ⚡ The Problem

1. **The Meatspace Identity Barrier:** Autonomous software has no passport, Social Security Number, or physical address. Traditional payment processors (Stripe, Visa) cannot onboard autonomous agents without human KYC/KYB.
2. **The Unit Economics of Micropayments:** Traditional payment rails carry a fixed fee of ~$0.30 + 2.9%. When an AI agent pays $0.005 to query an API, traditional payment fees exceed 6,000%.
3. **The Prompt Injection Threat:** Giving an LLM access to a master crypto private key risks total treasury drain if the agent encounters adversarial prompts or runaway loops.

---

## 💡 The Solution: AgentPay

AgentPay provides native, decentralized financial rails for the machine-to-machine economy:

* 🔐 **Non-Custodial Session Vaults (`AgentVault.sol`):** Cryptographically enforce daily spend allowances, time-to-live expiries, and whitelisted destinations directly on-chain on Base.
* 🌐 **Official x402 v2 Implementation:** Natively complies with the Linux Foundation and Base HTTP 402 specifications (`PAYMENT-REQUIRED` ➔ `PAYMENT-SIGNATURE` ➔ `PAYMENT-RESPONSE`).
* 🧠 **Anthropic Model Context Protocol (MCP):** Connects Claude Desktop, Cursor, and ChatGPT directly to on-chain vaults via stdio JSON-RPC tools.
* 🤖 **Flagship Agent ("AlphaScout"):** Autonomous research agent capable of multi-vendor data acquisition and real-time on-chain settlement.

---

## 🏛️ Architecture
