import http from 'http';
import { AgentPay } from './src/index.js';
import { createX402Paywall } from './src/middleware.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther } from 'viem';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('⚡ Starting Official x402 v2 Protocol Verification...\n');

  // Load contracts
  const broadcastPath = path.resolve('../agentpay-contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  const broadcastData = JSON.parse(fs.readFileSync(broadcastPath, 'utf8'));
  const creates = broadcastData.transactions.filter((tx: any) => tx.transactionType === 'CREATE');
  const USDC_ADDRESS = creates[0].contractAddress;
  const VAULT_ADDRESS = creates[1].contractAddress;

  const OWNER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const MERCHANT_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
  const MERCHANT_ADDRESS = privateKeyToAccount(MERCHANT_KEY).address;

  // 1. Host API with Official x402 v2 Middleware
  const paywall = createX402Paywall({
    costUsdc: '3.00',
    recipient: MERCHANT_ADDRESS,
    tokenAddress: USDC_ADDRESS,
    networkId: 'eip155:31337', // Local Anvil CAIP-2 ID
    description: 'High-frequency Base Sentiment Stream',
  });

  const server = http.createServer((req, res) => {
    paywall(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          feed: 'Live Sentiment: 94% Bullish accumulation on Base native primitives.',
          servedAt: new Date().toISOString(),
        })
      );
    });
  });

  await new Promise<void>((resolve) => server.listen(5001, resolve));
  console.log('🏛️  x402 v2 Resource Server live at http://127.0.0.1:5001/feed ($3.00 USDC)');

  // 2. Setup Agent with $10 allowance
  const ownerClient = new AgentPay({
    privateKey: OWNER_KEY,
    vaultAddress: VAULT_ADDRESS,
  });

  const agentPrivateKey = generatePrivateKey();
  const agentAccount = privateKeyToAccount(agentPrivateKey);

  await ownerClient.walletClient.sendTransaction({
    to: agentAccount.address,
    value: parseEther('0.1'),
  });

  await ownerClient.createSession({
    agentAddress: agentAccount.address,
    dailyLimitUsdc: '10.00',
    durationSeconds: 86400,
  });

  // 3. Agent queries endpoint via x402 v2
  const agentClient = new AgentPay({
    privateKey: agentPrivateKey,
    vaultAddress: VAULT_ADDRESS,
  });

  const result = await agentClient.fetchWithPayment('http://127.0.0.1:5001/feed');

  console.log('\n======================================================');
  console.log('✅ OFFICIAL x402 v2 HANDSHAKE VERIFIED');
  console.log('Network Standard  :', result.network);
  console.log('Amount Settled    :', `$${result.costPaid} USDC`);
  console.log('Settlement TxHash :', result.txHash);
  console.log('Payload Delivered :', result.data.feed);
  console.log('======================================================\n');

  server.close();
}

main().catch(console.error);