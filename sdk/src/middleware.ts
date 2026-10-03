import type { IncomingMessage, ServerResponse } from 'http';
import { createPublicClient, http, parseUnits, type Address, type Hash } from 'viem';
import { localhost } from 'viem/chains';
import type { X402PaymentRequired, X402PaymentSignature, X402PaymentResponse } from './types.js';

export interface X402PaywallConfig {
  costUsdc: string;       // e.g. "2.50"
  recipient: Address;
  tokenAddress: Address;
  networkId?: string;     // CAIP-2 network ID (default: "eip155:31337")
  rpcUrl?: string;
  description?: string;
}

export function createX402Paywall(config: X402PaywallConfig) {
  const publicClient = createPublicClient({
    chain: localhost,
    transport: http(config.rpcUrl || 'http://127.0.0.1:8545'),
  });

  const network = config.networkId || 'eip155:31337';
  const rawAmount = parseUnits(config.costUsdc, 6).toString();

  return async function handleX402(
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ) {
    const paymentSignatureHeader = req.headers['payment-signature'] as string | undefined;

    // 1. If unpaid, throw HTTP 402 with base64 PAYMENT-REQUIRED header
    if (!paymentSignatureHeader) {
      const requirements: X402PaymentRequired = {
        x402Version: 2,
        resource: {
          url: req.url,
          description: config.description || 'Protected x402 Resource',
        },
        accepts: [
          {
            scheme: 'exact',
            network,
            amount: rawAmount,
            asset: config.tokenAddress,
            payTo: config.recipient,
            maxTimeoutSeconds: 60,
            extra: {
              symbol: 'USDC',
              decimals: 6,
            },
          },
        ],
      };

      const encoded = Buffer.from(JSON.stringify(requirements)).toString('base64');
      
      res.statusCode = 402;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('PAYMENT-REQUIRED', encoded);
      res.end(JSON.stringify(requirements, null, 2));
      return;
    }

    // 2. Decode and verify PAYMENT-SIGNATURE
    try {
      const decodedJson = Buffer.from(paymentSignatureHeader, 'base64').toString('utf8');
      const sigPayload: X402PaymentSignature = JSON.parse(decodedJson);

      const receipt = await publicClient.getTransactionReceipt({
        hash: sigPayload.payload.txHash,
      });

      if (receipt.status !== 'success') {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: 'x402 Payment failed on-chain' }));
        return;
      }

      // 3. Attach PAYMENT-RESPONSE confirmation header on HTTP 200 delivery
      const confirmation: X402PaymentResponse = {
        success: true,
        txHash: sigPayload.payload.txHash,
        network,
      };

      res.setHeader(
        'PAYMENT-RESPONSE',
        Buffer.from(JSON.stringify(confirmation)).toString('base64')
      );

      next();
    } catch (err: any) {
      res.statusCode = 403;
      res.end(JSON.stringify({ error: 'Malformed or invalid PAYMENT-SIGNATURE' }));
    }
  };
}