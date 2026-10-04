import { formatUnits } from 'viem';
import { AgentPay } from '../index.js';

export async function getBaseTelemetry(sdk: AgentPay) {
  const block = await sdk.publicClient.getBlock();
  const baseFee = block.baseFeePerGas ? formatUnits(block.baseFeePerGas, 9) : '0.001';
  
  return {
    network: 'Base L2 (eip155:8453)',
    blockNumber: block.number.toString(),
    baseFeeGwei: baseFee,
    congestion: parseFloat(baseFee) < 1.0 ? 'Optimal' : 'Congested',
  };
}
