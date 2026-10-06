import http from 'http';
import { AgentPay } from './src/index.js';
import { createX402Paywall } from './src/middleware.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther } from 'viem';
import fs from 'fs';
import path from 'path';

function startVendor1(usdcAddress: string, merchantAddress: string) {
  const paywall = createX402Paywall({
    costUsdc: '1.50',
    recipient: merchantAddress as any,
    tokenAddress: usdcAddress as any,
    description: 'Whale Intelligence Stream',
  });

  const server = http.createServer((req, res) => {
    paywall(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          source: 'WhaleAlerts-Onchain',
          topTransactions: [
            { from: 'Whale-0x89a', to: 'Base-Aerodrome-Pool', amount: '$4,200,000 USDC' },
            { from: 'Fund-0x12c', to: 'Base-Aave-Market', amount: '$2,500,000 ETH' },
          ],
        })
      );
    });
  });

  server.listen(4001);
  return server;
}

function startVendor2(usdcAddress: string, merchantAddress: string) {
  const paywall = createX402Paywall({
    costUsdc: '0.75',
    recipient: merchantAddress as any,
    tokenAddress: usdcAddress as any,
    description: 'Base L2 Gas Predictor',
  });

  const server = http.createServer((req, res) => {
    paywall(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          source: 'L2-Gas-Predictor',
          networkCongestion: 'Low',
          averageFee: '$0.0024',
          recommendedRebalanceWindow: 'Next 4 hours',
        })
      );
    });
  });

  server.listen(4002);
  return server;
}

class Gofer {
  private sdk: AgentPay;

  constructor(sdk: AgentPay) {
    this.sdk = sdk;
  }

  async runErrand(objective: string) {
    console.log(`\n======================================================`);
    console.log(`🏃 GOFER ONLINE: AUTONOMOUS x402 ERRAND`);
    console.log(`🎯 Directive: "${objective}"`);
    console.log(`======================================================\n`);

    const initialStatus = await this.sdk.getSessionStatus();
    console.log(`💼 Vault Spending Budget: $${initialStatus.remainingToday} USDC remaining`);

    const expenses: { vendor: string; cost: string; txHash: string }[] = [];
    const collectedData: Record<string, any> = {};

    console.log('\n[Errand 1/2] Connecting to Whale Intelligence Node (Port 4001)...');
    const whaleData = await this.sdk.fetchWithPayment('http://127.0.0.1:4001/whales');
    expenses.push({
      vendor: 'WhaleAlerts Node',
      cost: whaleData.costPaid || '0',
      txHash: whaleData.txHash || 'N/A',
    });
    collectedData['whaleMetrics'] = whaleData.data;

    console.log('\n[Errand 2/2] Connecting to Network Gas Predictor (Port 4002)...');
    const gasData = await this.sdk.fetchWithPayment('http://127.0.0.1:4002/gas');
    expenses.push({
      vendor: 'GasPredictor API',
      cost: gasData.costPaid || '0',
      txHash: gasData.txHash || 'N/A',
    });
    collectedData['gasMetrics'] = gasData.data;

    const finalStatus = await this.sdk.getSessionStatus();
    const totalSpent = (
      parseFloat(expenses[0].cost) + parseFloat(expenses[1].cost)
    ).toFixed(2);

    console.log(`\n======================================================`);
    console.log(`📋 GOFER SYNTHESIZED EXECUTIVE DOSSIER`);
    console.log(`======================================================`);
    console.log(`📈 MARKET INTELLIGENCE SUMMARY:`);
    console.log(`• Whale Activity: $6.7M institutional liquidity deployed to Base protocols within the last hour.`);
    console.log(`• Optimal Execution Window: Current gas fees are ultra-low ($0.0024). Best execution window is ${collectedData.gasMetrics.recommendedRebalanceWindow}.`);

    console.log(`\n🧾 ON-CHAIN FINANCIAL RECEIPT:`);
    expenses.forEach((e, idx) => {
      console.log(`  ${idx + 1}. ${e.vendor}: $${e.cost} USDC (Tx: ${e.txHash})`);
    });
    console.log(`\n💰 Total Campaign Cost : $${totalSpent} USDC`);
    console.log(`🛡️ Vault Remaining Limit: $${finalStatus.remainingToday} USDC`);
    console.log(`======================================================\n`);
  }
}

async function main() {
  let broadcastPath = path.resolve('../contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  if (!fs.existsSync(broadcastPath)) {
    broadcastPath = path.resolve('../../agentpay-contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  }

  const broadcastData = JSON.parse(fs.readFileSync(broadcastPath, 'utf8'));
  const creates = broadcastData.transactions.filter((tx: any) => tx.transactionType === 'CREATE');
  
  const USDC_ADDRESS = creates[0].contractAddress;
  const VAULT_ADDRESS = creates.length > 1 ? creates[1].contractAddress : creates[0].contractAddress;

  const OWNER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const MERCHANT_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
  const MERCHANT_ADDRESS = privateKeyToAccount(MERCHANT_KEY).address;

  const server1 = startVendor1(USDC_ADDRESS, MERCHANT_ADDRESS);
  const server2 = startVendor2(USDC_ADDRESS, MERCHANT_ADDRESS);

  const ownerClient = new AgentPay({
    privateKey: OWNER_KEY,
    vaultAddress: VAULT_ADDRESS,
  });

  const goferKey = generatePrivateKey();
  const goferAccount = privateKeyToAccount(goferKey);

  await ownerClient.walletClient.sendTransaction({
    to: goferAccount.address,
    value: parseEther('0.1'),
  });

  await ownerClient.createSession({
    agentAddress: goferAccount.address,
    dailyLimitUsdc: '10.00',
    durationSeconds: 86400,
  });

  const goferClient = new AgentPay({
    privateKey: goferKey,
    vaultAddress: VAULT_ADDRESS,
  });

  const gofer = new Gofer(goferClient);
  await gofer.runErrand('Audit Base institutional inflows and identify optimal liquidity rebalance window');

  server1.close();
  server2.close();
}

main().catch(console.error);
