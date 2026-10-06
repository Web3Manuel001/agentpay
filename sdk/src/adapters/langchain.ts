import { AgentPay } from '../client.js';
import { type Address } from 'viem';

export interface LangChainToolDefinition {
  name: string;
  description: string;
  call: (input: any) => Promise<string>;
}

/**
 * Creates LangChain-compatible tool definitions for AgentPay
 */
export function createLangChainTools(sdk: AgentPay, usdcAddress: Address): LangChainToolDefinition[] {
  return [
    {
      name: 'agentpay_check_budget',
      description: 'Check available USDC spending budget and daily allowance remaining in AgentVault.',
      call: async () => {
        const status = await sdk.getSessionStatus();
        return JSON.stringify({
          dailyLimitUsdc: status.dailyLimit,
          spentTodayUsdc: status.spentToday,
          remainingTodayUsdc: status.remainingToday,
          isActive: status.isActive,
        });
      },
    },
    {
      name: 'agentpay_execute_payment',
      description: 'Execute an on-chain USDC payment on Base to a vendor or API recipient within daily limits.',
      call: async (input: { recipient: Address; amountUsdc: string }) => {
        const txHash = await sdk.pay({
          tokenAddress: usdcAddress,
          recipient: input.recipient,
          amountUsdc: input.amountUsdc,
        });
        return JSON.stringify({
          status: 'SUCCESS',
          amount: input.amountUsdc,
          recipient: input.recipient,
          txHash,
          network: 'Base L2',
        });
      },
    },
    {
      name: 'agentpay_fetch_x402',
      description: 'Fetch an API protected by an HTTP 402 paywall. Automatically pays required USDC on Base and returns data.',
      call: async (input: { url: string }) => {
        const result = await sdk.fetchWithPayment(input.url);
        return JSON.stringify({
          status: 'SETTLED',
          costPaid: result.costPaid,
          txHash: result.txHash,
          payload: result.data,
        });
      },
    },
  ];
}
