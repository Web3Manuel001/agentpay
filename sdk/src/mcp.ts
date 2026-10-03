import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { AgentPay } from './index.js';
import { type Address, type Hex } from 'viem';

// Environment variables passed by Claude Desktop or LLM host
const VAULT_ADDRESS = (process.env.AGENTPAY_VAULT_ADDRESS || '') as Address;
const AGENT_KEY = (process.env.AGENTPAY_AGENT_KEY || '') as Hex;
const RPC_URL = process.env.AGENTPAY_RPC_URL || 'http://127.0.0.1:8545';

if (!VAULT_ADDRESS || !AGENT_KEY) {
  console.error('Missing AGENTPAY_VAULT_ADDRESS or AGENTPAY_AGENT_KEY env variables.');
  process.exit(1);
}

// Initialize the Agent SDK client
const agent = new AgentPay({
  privateKey: AGENT_KEY,
  vaultAddress: VAULT_ADDRESS,
  rpcUrl: RPC_URL,
});

// Create MCP Server instance
const server = new Server(
  {
    name: 'agentpay-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. ADVERTISE AVAILABLE TOOLS TO CLAUDE
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_spend_allowance',
        description: 'Check the remaining daily USDC budget, amount spent today, and session status for this AI agent.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'fetch_paywalled_api',
        description: 'Fetch data from an API protected by an HTTP 402 paywall. Automatically pays required USDC from the AgentVault if within budget.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL of the API endpoint to query',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'transfer_usdc',
        description: 'Transfer USDC directly to a recipient address within the daily spending limit.',
        inputSchema: {
          type: 'object',
          properties: {
            tokenAddress: {
              type: 'string',
              description: 'The contract address of the ERC-20 token (e.g. USDC)',
            },
            recipient: {
              type: 'string',
              description: 'The destination Ethereum/Base address',
            },
            amountUsdc: {
              type: 'string',
              description: 'Amount of USDC to send (e.g. "1.50")',
            },
          },
          required: ['tokenAddress', 'recipient', 'amountUsdc'],
        },
      },
    ],
  };
});

// 2. HANDLE TOOL EXECUTION WHEN CLAUDE CALLS THEM
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'get_spend_allowance') {
      const status = await agent.getSessionStatus();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              dailyLimitUsdc: status.dailyLimit,
              spentTodayUsdc: status.spentToday,
              remainingTodayUsdc: status.remainingToday,
              isActive: status.isActive,
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'fetch_paywalled_api') {
      const { url } = args as { url: string };
      const result = await agent.fetchWithPayment(url);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'SUCCESS',
              costPaidUsdc: result.costPaid,
              txHash: result.txHash,
              payload: result.data,
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'transfer_usdc') {
      const { tokenAddress, recipient, amountUsdc } = args as {
        tokenAddress: Address;
        recipient: Address;
        amountUsdc: string;
      };

      const txHash = await agent.pay({
        tokenAddress,
        recipient,
        amountUsdc,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'PAYMENT_SENT',
              txHash,
              amountPaid: amountUsdc,
              recipient,
            }, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `AgentPay Execution Failed: ${error.message || error}`,
        },
      ],
    };
  }
});

// Connect over Stdio (standard transport for Claude Desktop)
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('AgentPay MCP Server running on stdio');