import { AgentPay } from '../client.js';
import { type Address } from 'viem';

export class AgentPayServices {
  private sdk: AgentPay;
  private usdcAddress: Address;

  constructor(sdk: AgentPay, usdcAddress: Address) {
    this.sdk = sdk;
    this.usdcAddress = usdcAddress;
  }

  /**
   * Pay a decentralized inference node (e.g. Akash, Render, Bittensor) per compute batch
   */
  async payInferenceNode(params: {
    nodeAddress: Address;
    computeUnits: number;
    pricePerUnitUsdc: string;
  }) {
    const totalCost = (params.computeUnits * parseFloat(params.pricePerUnitUsdc)).toFixed(6);

    const txHash = await this.sdk.pay({
      tokenAddress: this.usdcAddress,
      recipient: params.nodeAddress,
      amountUsdc: totalCost,
    });

    return {
      status: 'CONFIRMED',
      service: 'Decentralized AI Inference',
      computeUnits: params.computeUnits,
      amountSettled: `${totalCost} USDC`,
      txHash,
    };
  }

  /**
   * Settle storage pinning micro-fees (e.g. IPFS / Filecoin / Arweave gateway)
   */
  async payStoragePin(params: {
    storageProvider: Address;
    cidOrHash: string;
    bountyUsdc: string;
  }) {
    const txHash = await this.sdk.pay({
      tokenAddress: this.usdcAddress,
      recipient: params.storageProvider,
      amountUsdc: params.bountyUsdc,
    });

    return {
      status: 'PINNED',
      service: 'Decentralized Storage Pinning',
      cid: params.cidOrHash,
      amountPaid: `${params.bountyUsdc} USDC`,
      txHash,
    };
  }
}
