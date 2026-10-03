import http from 'http';
import { AgentPay } from './src/index.js';
import { createPaywall } from './src/middleware.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther } from 'viem';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🌐 Starting Autonomous HTTP 402 Commerce Demo...\n');

  // Load contract addresses
  const broadcastPath = path.resolve('../agentpay-contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  const broadcastData = JSON.parse(fs.readFileSync(broadcastPath, 'utf8'));
  const creates = broadcastData.transactions.filter((tx: any) => tx.transactionType === 'CREATE');
  const USDC_ADDRESS = creates[0].contractAddress;
  const VAULT_ADDRESS = creates[1].contractAddress;

  const OWNER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const MERCHANT_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'; // Anvil Account #1
  const MERCHANT_ADDRESS = privateKeyToAccount(MERCHANT_KEY).address;

  // 1. SPIN UP MERCHANT API WITH AGENTPAY 402 PAYWALL
  const paywall = createPaywall({
    costUsdc: '2.50',
    recipient: MERCHANT_ADDRESS,
    tokenAddress: USDC_ADDRESS,
  });

  const server = http.createServer((req, res) => {
    paywall(req, res, () => {
      // Premium data returned ONLY after on-chain payment verification
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          status: 'SUCCESS',
          premiumAlpha: 'Confidential: Institutional liquidity flow detected moving into Base DeFi.',
          timestamp: new Date().toISOString(),
        })
      );
    });
  });

  await new Promise<void>((resolve) => server.listen(3001, resolve));
  console.log('🏪 Merchant API live at http://127.0.0.1:3001/alpha (Price: $2.50 USDC)');

  // 2. SETUP HUMAN OWNER & AGENT SESSION
  const ownerClient = new AgentPay({
    privateKey: OWNER_KEY,
    vaultAddress: VAULT_ADDRESS,
  });

  const agentPrivateKey = generatePrivateKey();
  const agentAccount = privateKeyToAccount(agentPrivateKey);

  // Fund agent gas + create $10 daily allowance
  await ownerClient.walletClient.sendTransaction({
    to: agentAccount.address,
    value: parseEther('0.1'),
  });

  await ownerClient.createSession({
    agentAddress: agentAccount.address,
    dailyLimitUsdc: '10.00',
    durationSeconds: 86400,
  });
  console.log('🤖 Agent authorized with $10.00 spend allowance.');

  // 3. AGENT AUTONOMOUSLY QUERIES AND PAYS FOR DATA
  const agentClient = new AgentPay({
    privateKey: agentPrivateKey,
    vaultAddress: VAULT_ADDRESS,
  });

  console.log('\n🔎 Agent requesting premium data from API...');
  const result = await agentClient.fetchWithPayment('http://127.0.0.1:3001/alpha');

  console.log('\n======================================================');
  console.log('🎉 AUTONOMOUS MACHINE-TO-MACHINE COMMERCE COMPLETED:');
  console.log('Cost Paid On-Chain :', `$${result.costPaid} USDC`);
  console.log('Payment Hash       :', result.txHash);
  console.log('Data Unlocked      :', result.data.premiumAlpha);
  console.log('======================================================\n');

  server.close();
}

main().catch(console.error);