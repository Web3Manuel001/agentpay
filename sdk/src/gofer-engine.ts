import { AgentPay } from './index.js';
import { 
  type Address, 
  type Hash, 
  parseUnits, 
  formatUnits, 
  encodeFunctionData,
  createPublicClient,
  http
} from 'viem';
import { localhost } from 'viem/chains';

// Aerodrome Router Minimal ABI on Base
const AERODROME_ROUTER_ABI = [
  {
    name: 'swapExactTokensForTokens',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      {
        name: 'routes',
        type: 'tuple[]',
        components: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'stable', type: 'bool' },
          { name: 'factory', type: 'address' },
        ],
      },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
  },
] as const;

export interface ErrandResult {
  errandId: string;
  type: 'PAYMENT' | 'STAGED_SWAP' | 'CONDITIONAL' | 'x402_RESEARCH';
  status: 'EXECUTED' | 'STAGED' | 'BLOCKED_BY_GUARDRAIL' | 'FAILED';
  summary: string;
  txHash?: Hash;
  payload?: any;
}

export class GoferEngine {
  public sdk: AgentPay;

  constructor(sdk: AgentPay) {
    this.sdk = sdk;
  }

  // --- ERRAND 1: DIRECT OUTBOUND VENDOR SETTLEMENT ---
  /**
   * Directly pays a human, contractor, or external API on Base within daily limit
   */
  async executeDirectPay(params: {
    tokenAddress: Address;
    recipient: Address;
    amountUsdc: string;
    memo?: string;
  }): Promise<ErrandResult> {
    const errandId = `pay_${Date.now()}`;
    const status = await this.sdk.getSessionStatus();

    // Enforce pre-flight check
    if (parseFloat(params.amountUsdc) > parseFloat(status.remainingToday)) {
      return {
        errandId,
        type: 'PAYMENT',
        status: 'BLOCKED_BY_GUARDRAIL',
        summary: `Blocked: $${params.amountUsdc} exceeds remaining allowance of $${status.remainingToday} USDC.`,
      };
    }

    const txHash = await this.sdk.pay({
      tokenAddress: params.tokenAddress,
      recipient: params.recipient,
      amountUsdc: params.amountUsdc,
    });

    return {
      errandId,
      type: 'PAYMENT',
      status: 'EXECUTED',
      summary: `Successfully settled $${params.amountUsdc} USDC to ${params.recipient}. Memo: ${params.memo || 'None'}`,
      txHash,
    };
  }

  // --- ERRAND 2: STAGE & SIGN DEX SWAP (AERODROME ON BASE) ---
  /**
   * Plans and stages a decentralized swap without blind-signing
   * Generates execution payload for 1-click user confirmation
   */
  async stageSwap(params: {
    tokenIn: Address;
    tokenOut: Address;
    amountInUsdc: string;
    routerAddress: Address;
    recipient: Address;
  }): Promise<ErrandResult> {
    const errandId = `swap_${Date.now()}`;
    const amountInUnits = parseUnits(params.amountInUsdc, 6);

    // Format Aerodrome swap route calldata
    const calldata = encodeFunctionData({
      abi: AERODROME_ROUTER_ABI,
      functionName: 'swapExactTokensForTokens',
      args: [
        amountInUnits,
        0n, // amountOutMin (calculated via slippage in prod)
        [
          {
            from: params.tokenIn,
            to: params.tokenOut,
            stable: false,
            factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da', // Base Aerodrome Factory
          },
        ],
        params.recipient,
        BigInt(Math.floor(Date.now() / 1000) + 1200), // 20m deadline
      ],
    });

    return {
      errandId,
      type: 'STAGED_SWAP',
      status: 'STAGED',
      summary: `Staged swap of $${params.amountInUsdc} USDC for destination token. Awaiting user 1-click execution.`,
      payload: {
        targetRouter: params.routerAddress,
        amountIn: params.amountInUsdc,
        calldata,
        network: 'Base L2 (eip155:8453)',
      },
    };
  }

  // --- ERRAND 3: CONDITIONAL / TRIGGERED EXECUTION ---
  /**
   * Executes an action only if on-chain state conditions are met (e.g. gas threshold)
   */
  async executeConditional(params: {
    maxGasGwei: number;
    action: () => Promise<Hash>;
  }): Promise<ErrandResult> {
    const errandId = `cond_${Date.now()}`;
    const block = await this.sdk.publicClient.getBlock();
    const currentBaseFeeGwei = block.baseFeePerGas 
      ? parseFloat(formatUnits(block.baseFeePerGas, 9)) 
      : 0.001;

    if (currentBaseFeeGwei > params.maxGasGwei) {
      return {
        errandId,
        type: 'CONDITIONAL',
        status: 'BLOCKED_BY_GUARDRAIL',
        summary: `Trigger unfulfilled: Current gas (${currentBaseFeeGwei.toFixed(4)} gwei) exceeds limit (${params.maxGasGwei} gwei).`,
      };
    }

    const txHash = await params.action();

    return {
      errandId,
      type: 'CONDITIONAL',
      status: 'EXECUTED',
      summary: `Condition met: Executed at ${currentBaseFeeGwei.toFixed(4)} gwei gas.`,
      txHash,
    };
  }

  // --- NATURAL LANGUAGE INTENT ROUTER ---
  /**
   * Parses natural language directives into structured errands
   */
  parseIntent(prompt: string): 'PAY' | 'SWAP' | 'CONDITIONAL' | 'RESEARCH' {
    const lower = prompt.toLowerCase();
    if (lower.startsWith('pay') || lower.includes('send')) return 'PAY';
    if (lower.startsWith('swap') || lower.includes('buy eth') || lower.includes('trade')) return 'SWAP';
    if (lower.includes('if gas') || lower.includes('when gas')) return 'CONDITIONAL';
    return 'RESEARCH';
  }
}