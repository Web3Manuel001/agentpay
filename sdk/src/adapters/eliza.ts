import { Paythos } from '../client.js';
import { type Address } from 'viem';

export interface ElizaAction {
  name: string;
  description: string;
  handler: (runtime: any, message: any, state: any) => Promise<any>;
}

export interface ElizaProvider {
  get: (runtime: any, message: any, state: any) => Promise<string>;
}

export interface ElizaPlugin {
  name: string;
  description: string;
  actions: ElizaAction[];
  providers: ElizaProvider[];
}

/**
 * Native ElizaOS Plugin for AgentPay Session Vaults & x402
 */
export function createAgentPayElizaPlugin(sdk: Paythos, usdcAddress: Address): ElizaPlugin {
  return {
    name: 'plugin-agentpay',
    description: 'Enforces non-custodial on-chain spend guardrails and handles x402 micropayments on Base.',
    
    // Injects live wallet balance into Eliza's conversational memory
    providers: [
      {
        get: async () => {
          const status = await sdk.getSessionStatus();
          return `[AgentPay Vault Status]: Daily Allowance: $${status.dailyLimit} USDC | Remaining Today: $${status.remainingToday} USDC | Vault Guardrail: ${status.isActive ? 'ACTIVE' : 'FROZEN'}`;
        },
      },
    ],

    // Actions Eliza can take autonomously
    actions: [
      {
        name: 'AGENTPAY_SETTLE_PAYMENT',
        description: 'Settle a payment in USDC on Base to a recipient under vault daily limits.',
        handler: async (runtime: any, message: any, state: any) => {
          const recipient = state.recipient as Address;
          const amountUsdc = state.amountUsdc as string;

          const txHash = await sdk.pay({
            tokenAddress: usdcAddress,
            recipient,
            amountUsdc,
          });

          return {
            success: true,
            txHash,
            summary: `Settled $${amountUsdc} USDC to ${recipient} on Base.`,
          };
        },
      },
      {
        name: 'AGENTPAY_X402_FETCH',
        description: 'Query an API behind an HTTP 402 paywall and settle micropayment on Base.',
        handler: async (runtime: any, message: any, state: any) => {
          const url = state.url as string;
          const result = await sdk.fetchWithPayment(url);
          return {
            success: true,
            cost: result.costPaid,
            txHash: result.txHash,
            data: result.data,
          };
        },
      },
    ],
  };
}
