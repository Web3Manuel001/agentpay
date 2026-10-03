import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits,
  formatUnits,
  type Address,
  type Hex,
  type Hash,
  type Account,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { localhost } from 'viem/chains';
import AgentVaultABI from './abi/AgentVault.json' with { type: 'json' };
import type { X402PaymentRequired, X402PaymentSignature, X402PaymentResponse } from './types.js';

export interface SessionStatus {
  dailyLimit: string;
  spentToday: string;
  remainingToday: string;
  lastResetTimestamp: bigint;
  expiresAt: bigint;
  isActive: boolean;
}

export class AgentPay {
  public publicClient;
  public walletClient;
  public account: Account;
  public vaultAddress: Address;

  constructor(options: {
    privateKey: Hex;
    vaultAddress: Address;
    rpcUrl?: string;
  }) {
    this.account = privateKeyToAccount(options.privateKey);
    this.vaultAddress = options.vaultAddress;

    const transport = http(options.rpcUrl || 'http://127.0.0.1:8545');

    this.publicClient = createPublicClient({
      chain: localhost,
      transport,
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: localhost,
      transport,
    });
  }

  // --- AGENT ACTIONS ---

  /**
   * Get the current session's remaining allowance and status
   */
  async getSessionStatus(agentAddress?: Address): Promise<SessionStatus> {
    const target = agentAddress || this.account.address;
    const policy = (await this.publicClient.readContract({
      address: this.vaultAddress,
      abi: AgentVaultABI,
      functionName: 'sessions',
      args: [target],
    })) as [bigint, bigint, bigint, bigint, boolean];

    const dailyLimit = policy[0];
    const spentToday = policy[1];
    const lastReset = policy[2];
    const expiresAt = policy[3];
    const isActive = policy[4];

    const remaining = dailyLimit > spentToday ? dailyLimit - spentToday : 0n;

    return {
      dailyLimit: formatUnits(dailyLimit, 6),
      spentToday: formatUnits(spentToday, 6),
      remainingToday: formatUnits(remaining, 6),
      lastResetTimestamp: lastReset,
      expiresAt,
      isActive,
    };
  }

  /**
   * Execute an on-chain micro-payment to a recipient
   */
  async pay(params: {
    tokenAddress: Address;
    recipient: Address;
    amountUsdc: string;
  }): Promise<Hash> {
    const parsedAmount = parseUnits(params.amountUsdc, 6);

    const hash = await this.walletClient.writeContract({
      address: this.vaultAddress,
      abi: AgentVaultABI,
      functionName: 'executePayment',
      args: [params.tokenAddress, params.recipient, parsedAmount],
    });

    await this.publicClient.waitForTransactionReceipt({ hash });
    return hash;
  }

  /**
   * Official x402 v2 Protocol Fetch:
   * Decodes PAYMENT-REQUIRED, pays via AgentVault, retries with PAYMENT-SIGNATURE,
   * and verifies PAYMENT-RESPONSE.
   */
  async fetchWithPayment(
    url: string,
    options: RequestInit = {}
  ): Promise<{ data: any; txHash?: Hash; costPaid?: string; network?: string }> {
    // 1. Initial Attempt
    const initialResponse = await fetch(url, options);

    if (initialResponse.status !== 402) {
      return { data: await initialResponse.json() };
    }

    // 2. Extract and Decode x402 v2 PAYMENT-REQUIRED Header
    const paymentRequiredHeader = initialResponse.headers.get('payment-required');
    let requirements: X402PaymentRequired;

    if (paymentRequiredHeader) {
      const decoded = Buffer.from(paymentRequiredHeader, 'base64').toString('utf8');
      requirements = JSON.parse(decoded);
    } else {
      requirements = (await initialResponse.json()) as X402PaymentRequired;
    }

    // Select the first supported "exact" scheme
    const paymentOption = requirements.accepts.find((opt) => opt.scheme === 'exact');
    if (!paymentOption) {
      throw new Error('No supported x402 payment option found in server response.');
    }

    const costInUnits = formatUnits(BigInt(paymentOption.amount), 6);
    console.log(`\n💳 [x402 v2] Paywall Challenge Detected!`);
    console.log(`   Network  : ${paymentOption.network}`);
    console.log(`   Price    : $${costInUnits} USDC`);
    console.log(`   PayTo    : ${paymentOption.payTo}`);

    // 3. Execute On-Chain Settlement via AgentVault
    const txHash = await this.pay({
      tokenAddress: paymentOption.asset,
      recipient: paymentOption.payTo,
      amountUsdc: costInUnits,
    });

    console.log(`   Settlement Broadcast! Tx: ${txHash}`);

    // 4. Construct x402 v2 PAYMENT-SIGNATURE Payload
    const signaturePayload: X402PaymentSignature = {
      x402Version: 2,
      scheme: 'exact',
      network: paymentOption.network,
      payload: {
        txHash,
        payer: this.account.address,
        amount: paymentOption.amount,
      },
    };

    const encodedSignature = Buffer.from(JSON.stringify(signaturePayload)).toString('base64');

    // 5. Retry Request with PAYMENT-SIGNATURE Header
    const headers = new Headers(options.headers || {});
    headers.set('PAYMENT-SIGNATURE', encodedSignature);

    const paidResponse = await fetch(url, {
      ...options,
      headers,
    });

    if (!paidResponse.ok) {
      throw new Error(`x402 Settlement Verification Failed: ${paidResponse.statusText}`);
    }

    // 6. Inspect Server's PAYMENT-RESPONSE Confirmation Header
    const responseHeader = paidResponse.headers.get('payment-response');
    if (responseHeader) {
      const settlementConfirm: X402PaymentResponse = JSON.parse(
        Buffer.from(responseHeader, 'base64').toString('utf8')
      );
      console.log(`   Confirmed by Server! [success: ${settlementConfirm.success}]`);
    }

    return {
      data: await paidResponse.json(),
      txHash,
      costPaid: costInUnits,
      network: paymentOption.network,
    };
  }

  // --- OWNER / HUMAN CONTROLS ---

  /**
   * Authorize a new agent session key with strict limits
   */
  async createSession(params: {
    agentAddress: Address;
    dailyLimitUsdc: string;
    durationSeconds: number;
  }): Promise<Hash> {
    const limit = parseUnits(params.dailyLimitUsdc, 6);

    const hash = await this.walletClient.writeContract({
      address: this.vaultAddress,
      abi: AgentVaultABI,
      functionName: 'createSession',
      args: [params.agentAddress, limit, BigInt(params.durationSeconds)],
    });

    await this.publicClient.waitForTransactionReceipt({ hash });
    return hash;
  }

  /**
   * Emergency Kill-Switch: Revoke an agent session immediately
   */
  async revokeSession(agentAddress: Address): Promise<Hash> {
    const hash = await this.walletClient.writeContract({
      address: this.vaultAddress,
      abi: AgentVaultABI,
      functionName: 'revokeSession',
      args: [agentAddress],
    });

    await this.publicClient.waitForTransactionReceipt({ hash });
    return hash;
  }
}