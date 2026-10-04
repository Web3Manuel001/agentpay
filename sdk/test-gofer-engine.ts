import { AgentPay } from './src/index.js';
import { GoferEngine } from './src/gofer-engine.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther } from 'viem';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('⚡ Starting Full Gofer Multi-Action Errand Suite...\n');

  // Load contract addresses from Foundry broadcast
  let broadcastPath = path.resolve('../contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  if (!fs.existsSync(broadcastPath)) {
    broadcastPath = path.resolve('../../agentpay-contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  }

  const broadcastData = JSON.parse(fs.readFileSync(broadcastPath, 'utf8'));

  // Explicitly match contracts by their true Foundry contractName
  const vaultTx = broadcastData.transactions.find(
    (tx: any) => tx.transactionType === 'CREATE' && tx.contractName === 'AgentVault'
  );
  const usdcTx = broadcastData.transactions.find(
    (tx: any) => tx.transactionType === 'CREATE' && tx.contractName === 'MockUSDC'
  );

  if (!vaultTx || !usdcTx) {
    throw new Error('Could not locate AgentVault or MockUSDC in broadcast logs. Please re-run forge script in contracts folder.');
  }

  const VAULT_ADDRESS = vaultTx.contractAddress;
  const USDC_ADDRESS = usdcTx.contractAddress;

  console.log(`🏛️  AgentVault Contract : ${VAULT_ADDRESS}`);
  console.log(`💵 MockUSDC Contract   : ${USDC_ADDRESS}`);

  const OWNER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const VENDOR_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Anvil Account #1

  // 1. Setup Human Vault & Authorize Gofer with $25 daily allowance
  const ownerClient = new AgentPay({
    privateKey: OWNER_KEY,
    vaultAddress: VAULT_ADDRESS,
  });

  // Verify vault has bytecode on this Anvil node
  const bytecode = await ownerClient.publicClient.getBytecode({ address: VAULT_ADDRESS });
  if (!bytecode || bytecode === '0x') {
    throw new Error(`No bytecode at Vault ${VAULT_ADDRESS}! Anvil was restarted. Run forge script in contracts.`);
  }

  const goferKey = generatePrivateKey();
  const goferAccount = privateKeyToAccount(goferKey);

  console.log(`🤖 Ephemeral Gofer Key  : ${goferAccount.address}\n`);

  await ownerClient.walletClient.sendTransaction({
    to: goferAccount.address,
    value: parseEther('0.1'),
  });

  await ownerClient.createSession({
    agentAddress: goferAccount.address,
    dailyLimitUsdc: '25.00',
    durationSeconds: 86400,
  });

  const goferClient = new AgentPay({
    privateKey: goferKey,
    vaultAddress: VAULT_ADDRESS,
  });

  const engine = new GoferEngine(goferClient);

  // --- ERRAND 1: OUTBOUND VENDOR SETTLEMENT ---
  console.log('💼 [Errand 1] Direct Outbound Payment to Vendor...');
  const payResult = await engine.executeDirectPay({
    tokenAddress: USDC_ADDRESS,
    recipient: VENDOR_ADDRESS,
    amountUsdc: '2.50',
    memo: 'Server Maintenance Micro-Bounty',
  });
  console.log(`✅ Status: ${payResult.status}`);
  console.log(`   Summary : ${payResult.summary}`);
  console.log(`   TxHash  : ${payResult.txHash}\n`);

  // --- ERRAND 2: STAGE & SIGN DEX SWAP ON BASE ---
  console.log('🔄 [Errand 2] Staging Decentralized Swap on Aerodrome Router...');
  const swapResult = await engine.stageSwap({
    tokenIn: USDC_ADDRESS,
    tokenOut: '0x4200000000000000000000000000000000000006', // WETH on Base
    amountInUsdc: '5.00',
    routerAddress: '0xcF77a3Ba9A5CA399B7c97c7485615499363F3795', // Aerodrome Router
    recipient: VENDOR_ADDRESS,
  });
  console.log(`✅ Status: ${swapResult.status}`);
  console.log(`   Summary   : ${swapResult.summary}`);
  console.log(`   Router    : ${swapResult.payload.targetRouter}`);
  console.log(`   Calldata  : ${swapResult.payload.calldata.substring(0, 42)}...\n`);

  // --- ERRAND 3: CONDITIONAL / TRIGGERED EXECUTION ---
  console.log('⛽ [Errand 3] Testing Conditional Gas Trigger Execution...');
  const condResult = await engine.executeConditional({
    maxGasGwei: 2.0, // Condition: Only execute if gas < 2.0 gwei
    action: async () => {
      return await goferClient.pay({
        tokenAddress: USDC_ADDRESS,
        recipient: VENDOR_ADDRESS,
        amountUsdc: '1.00',
      });
    },
  });
  console.log(`✅ Status: ${condResult.status}`);
  console.log(`   Summary : ${condResult.summary}`);
  console.log(`   TxHash  : ${condResult.txHash}\n`);

  // 4. Verify Final Vault Balance Under Guardrails
  const finalBudget = await goferClient.getSessionStatus();
  console.log('======================================================');
  console.log('🎯 GOFER MULTI-ACTION EXECUTION SUITE COMPLETE');
  console.log(`- Daily Allowance : $${finalBudget.dailyLimit} USDC`);
  console.log(`- Total Spent     : $${finalBudget.spentToday} USDC`);
  console.log(`- Remaining Today : $${finalBudget.remainingToday} USDC`);
  console.log('======================================================\n');
}

main().catch(console.error);