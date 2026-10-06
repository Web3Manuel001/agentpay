import { AgentPay } from '../index.js';
import { type Address } from 'viem';

export async function executeOutboundPayment(params: {
  sdk: AgentPay;
  tokenAddress: Address;
  recipient: Address;
  amountUsdc: string;
  memo?: string;
}) {
  const status = await params.sdk.getSessionStatus();

  if (parseFloat(params.amountUsdc) > parseFloat(status.remainingToday)) {
    return {
      status: 'BLOCKED_BY_GUARDRAIL',
      error: `Requested $${params.amountUsdc} exceeds available allowance of $${status.remainingToday} USDC`,
    };
  }

  const txHash = await params.sdk.pay({
    tokenAddress: params.tokenAddress,
    recipient: params.recipient,
    amountUsdc: params.amountUsdc,
  });

  return {
    status: 'SUCCESS',
    amountPaid: params.amountUsdc,
    recipient: params.recipient,
    memo: params.memo || 'Errand Settlement',
    txHash,
  };
}
