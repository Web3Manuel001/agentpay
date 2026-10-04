import { AgentPay } from './src/index.js';
import { GoferEngine } from './src/gofer-engine.js';
import { GoferBrain } from './src/gofer-brain.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther } from 'viem';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Load contract addresses
  let broadcastPath = path.resolve('../contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  if (!fs.existsSync(broadcastPath)) {
    broadcastPath = path.resolve('../../agentpay-contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  }

  const broadcastData = JSON.parse(fs.readFileSync(broadcastPath, 'utf8'));
  const vaultTx = broadcastData.transactions.find((tx: any) => tx.contractName === 'AgentVault');
  const usdcTx = broadcastData.transactions.find((tx: any) => tx.contractName === 'MockUSDC');

  const VAULT_ADDRESS = vaultTx.contractAddress;
  const USDC_ADDRESS = usdcTx.contractAddress;

  const OWNER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

  const ownerClient = new AgentPay({
    privateKey: OWNER_KEY,
    vaultAddress: VAULT_ADDRESS,
  });

  const goferKey = generatePrivateKey();
  const goferAccount = privateKeyToAccount(goferKey);

  // Fund Gofer with gas & $30 daily allowance
  await ownerClient.walletClient.sendTransaction({
    to: goferAccount.address,
    value: parseEther('0.1'),
  });

  await ownerClient.createSession({
    agentAddress: goferAccount.address,
    dailyLimitUsdc: '30.00',
    durationSeconds: 86400,
  });

  const goferClient = new AgentPay({
    privateKey: goferKey,
    vaultAddress: VAULT_ADDRESS,
  });

  const engine = new GoferEngine(goferClient);
  const brain = new GoferBrain(engine, USDC_ADDRESS);

  // SEND AN OPEN-ENDED NATURAL LANGUAGE ERRAND
  const userPrompt = "Gofer, audit Base TVL, check ETH price, and pay 2.50 USDC to my API vendor at 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 for server maintenance.";

  const finalDossier = await brain.planAndExecute(userPrompt);

  console.log('\n🎯 FINAL DOSSIER DELIVERED BY GOFER:');
  console.log(finalDossier);
}

main().catch(console.error);