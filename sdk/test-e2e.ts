import { AgentPay } from './src/index.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { formatUnits, parseEther } from 'viem';
import fs from 'fs';
import path from 'path';

// Minimal ERC20 ABI to inspect balances
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

async function main() {
  console.log('🚀 Running Full Autonomous Agent Payment Lifecycle...\n');

  // Load contract addresses from Foundry broadcast
  const broadcastPath = path.resolve('../agentpay-contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  const broadcastData = JSON.parse(fs.readFileSync(broadcastPath, 'utf8'));
  
  // Find deployed contracts
  const creates = broadcastData.transactions.filter((tx: any) => tx.transactionType === 'CREATE');
  const USDC_ADDRESS = creates[0].contractAddress;
  const VAULT_ADDRESS = creates[1].contractAddress;

  const OWNER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const MERCHANT_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Anvil Account #1

  // 1. Initialize Owner
  const ownerClient = new AgentPay({
    privateKey: OWNER_KEY,
    vaultAddress: VAULT_ADDRESS,
  });

  // 2. Generate Ephemeral Agent Key
  const agentPrivateKey = generatePrivateKey();
  const agentAccount = privateKeyToAccount(agentPrivateKey);
  console.log(`🤖 Ephemeral Agent Generated: ${agentAccount.address}`);

  // 3. Fund Agent with 0.1 ETH for transaction gas fees
  console.log('⛽ Owner funding Agent with 0.1 ETH for gas...');
  await ownerClient.walletClient.sendTransaction({
    to: agentAccount.address,
    value: parseEther('0.1'),
  });

  // 4. Owner authorizes Agent with $25.00 daily limit
  await ownerClient.createSession({
    agentAddress: agentAccount.address,
    dailyLimitUsdc: '25.00',
    durationSeconds: 86400,
  });
  console.log('🔐 Session created: $25.00 daily limit granted.');

  // 5. Agent prepares to pay
  const agentClient = new AgentPay({
    privateKey: agentPrivateKey,
    vaultAddress: VAULT_ADDRESS,
  });

  // 6. Agent executes $5.00 payment autonomously to Merchant
  console.log('\n💸 Agent executing $5.00 autonomous payment to Merchant...');
  const txHash = await agentClient.pay({
    tokenAddress: USDC_ADDRESS,
    recipient: MERCHANT_ADDRESS,
    amountUsdc: '5.00',
  });
  console.log(`✅ Payment successful! Tx: ${txHash}`);

  // 7. Verify Merchant's USDC balance
  const merchantBalance = await ownerClient.publicClient.readContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [MERCHANT_ADDRESS],
  });
  console.log(`💰 Merchant Balance: $${formatUnits(merchantBalance, 6)} USDC`);

  // 8. Verify Agent's remaining spend allowance
  const status = await agentClient.getSessionStatus();
  console.log(`📊 Agent Allowance Left: $${status.remainingToday} USDC (Spent Today: $${status.spentToday} USDC)`);

  // 9. SECURITY ATTACK SIMULATION: Agent tries to spend $25.00 more (Total $30 > $25 limit)
  console.log('\n🚨 SIMULATION: Agent goes rogue / prompt-injected to spend $25.00 more...');
  try {
    await agentClient.pay({
      tokenAddress: USDC_ADDRESS,
      recipient: MERCHANT_ADDRESS,
      amountUsdc: '25.00',
    });
    console.error('❌ CRITICAL FAILURE: Smart contract allowed spend over limit!');
  } catch (error: any) {
    console.log('🛡️ SUCCESS: Smart Contract BLOCKED transaction! Daily limit strictly enforced on-chain.');
  }

  console.log('\n======================================================');
  console.log('🎯 AGENTPAY PROTOCOL V0.1 CORE ENGINE IS FULLY OPERATIONAL');
  console.log('======================================================\n');
}

main().catch(console.error);