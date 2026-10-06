import { Paythos } from '../sdk/src/client.js';
import { GoferAgent } from './brain/agent.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther } from 'viem';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('../sdk/.env') });

async function main() {
  const VAULT_ADDRESS = '0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347'; // Live Base Sepolia
  const OWNER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // Base Sepolia USDC

  const ownerClient = new Paythos({
    privateKey: OWNER_KEY,
    vaultAddress: VAULT_ADDRESS,
    rpcUrl: 'https://sepolia.base.org',
  });

  const goferKey = generatePrivateKey();
  const goferAccount = privateKeyToAccount(goferKey);

  console.log(`🤖 Gofer Ephemeral Key : ${goferAccount.address}`);

  const goferClient = new Paythos({
    privateKey: goferKey,
    vaultAddress: VAULT_ADDRESS,
    rpcUrl: 'https://sepolia.base.org',
  });

  const agent = new GoferAgent({
    sdk: goferClient,
    usdcAddress: USDC_ADDRESS,
    groqApiKey: process.env.GROQ_API_KEY,
  });

  const prompt = process.argv[2] || "Audit Base ecosystem TVL and check live ETH price.";
  const report = await agent.executeMission(prompt);
  console.log(report);
}

main().catch(console.error);
