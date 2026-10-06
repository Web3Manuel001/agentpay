import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AgentPay } from './client.js';
import { type Address, type Hex } from 'viem';

// Universal Environment Fallbacks
const VAULT_ADDRESS = (process.env.AGENTPAY_VAULT_ADDRESS || process.env.VAULT_ADDRESS || '0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347') as Address;
const AGENT_KEY = (process.env.AGENTPAY_AGENT_KEY || process.env.AGENT_KEY || '') as Hex;
const RPC_URL = process.env.AGENTPAY_RPC_URL || process.env.RPC_URL || 'https://sepolia.base.org';

const server = new Server(
  {
    name: 'agentpay-universal-mcp',
    version: '0.2.0',
  },
  {
    capabilities: { tools: {} },
  }
);

// Lazy SDK initializer to support dynamic environment configurations
function getClient(): AgentPay {
  if (!AGENT_KEY) {
    throw new Error('Missing AGENTPAY_AGENT_KEY environment variable for MCP session.');
  }
  return new AgentPay({
    privateKey: AGENT_KEY,
    vaultAddress: VAULT_ADDRESS,
    rpcUrl: RPC_URL,
  });
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'agentpay_get_budget',
        description: 'Check available USDC spending budget and session status in the on-chain AgentVault.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'agentpay_execute_payment',
        description: 'Execute an on-chain USDC payment to an address on Base within daily allowance limits.',
        inputSchema: {
          type: 'object',
          properties: {
            tokenAddress: { type: 'string', description: 'ERC-20 token address (defaults to Base USDC)' },
            recipient: { type: 'string', description: 'Destination 0x address' },
            amountUsdc: { type: 'string', description: 'Amount in USDC (e.g. "1.50")' },
          },
          required: ['recipient', 'amountUsdc'],
        },
      },
      {
        name: 'agentpay_fetch_x402_api',
        description: 'Fetch an API protected by an HTTP 402 paywall. Automatically pays required USDC from the vault and unlocks data.',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL of the paywalled resource' },
          },
          required: ['url'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const client = getClient();

  try {
    if (name === 'agentpay_get_budget') {
      const status = await client.getSessionStatus();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            dailyLimitUsdc: status.dailyLimit,
            remainingTodayUsdc: status.remainingToday,
            spentTodayUsdc: status.spentToday,
            isPolicyActive: status.isActive,
          }, null, 2),
        }],
      };
    }

    if (name === 'agentpay_execute_payment') {
      const { recipient, amountUsdc, tokenAddress } = args as any;
      const txHash = await client.pay({
        tokenAddress: tokenAddress || '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
        recipient: recipient as Address,
        amountUsdc: String(amountUsdc),
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'SETTLED',
            txHash,
            amountPaid: amountUsdc,
            recipient,
          }, null, 2),
        }],
      };
    }

    if (name === 'agentpay_fetch_x402_api') {
      const { url } = args as any;
      const result = await client.fetchWithPayment(url);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'SUCCESS',
            costPaidUsdc: result.costPaid,
            txHash: result.txHash,
            payload: result.data,
          }, null, 2),
        }],
      };
    }

    throw new Error(`Tool ${name} not recognized.`);
  } catch (err: any) {
    return {
      isError: true,
      content: [{ type: 'text', text: `AgentPay MCP Error: ${err.message || err}` }],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
