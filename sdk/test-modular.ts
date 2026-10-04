import { AgentPay } from './src/client.js';
import { GoferAgent } from './src/brain/agent.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther } from 'viem';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('⚡ Initializing Complete Gofer Architecture with Base Token Intelligence...\n');

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

  // Defensive check: verify contract exists on the active Anvil instance
  const bytecode = await ownerClient.publicClient.getBytecode({ address: VAULT_ADDRESS });
  if (!bytecode || bytecode === '0x') {
    throw new Error(`\n❌ No bytecode found at ${VAULT_ADDRESS}! Your local Anvil was restarted.\nRun: cd ~/agentpay/contracts && forge script script/DeployAgentVault.s.sol:DeployAgentVault --fork-url http://127.0.0.1:8545 --broadcast\n`);
  }

  const goferKey = generatePrivateKey();
  const goferAccount = privateKeyToAccount(goferKey);

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

  const agent = new GoferAgent({
    sdk: goferClient,
    usdcAddress: USDC_ADDRESS,
    groqApiKey: process.env.GROQ_API_KEY,
  });

  const directive = "Gofer, audit the live on-chain price and liquidity for the AERO token on Base, check network gas, and pay 1.50 USDC to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 for liquidity monitoring.";
  
  const report = await agent.executeMission(directive);
  console.log('\n======================================================');
  console.log('🎯 LIVE GOFER BASE TOKEN & ERRAND REPORT:');
  console.log('======================================================');
  console.log(report);
}

main().catch(console.error);
