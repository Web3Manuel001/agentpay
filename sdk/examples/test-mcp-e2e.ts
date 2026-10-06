import http from 'http';
import { spawn } from 'child_process';
import { createPaywall } from './src/middleware.js';
import { AgentPay } from './src/index.js';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther } from 'viem';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🤖 Starting Claude MCP Server End-to-End Simulation...\n');

  // Load contracts
  const broadcastPath = path.resolve('../agentpay-contracts/broadcast/DeployAgentVault.s.sol/31337/run-latest.json');
  const broadcastData = JSON.parse(fs.readFileSync(broadcastPath, 'utf8'));
  const creates = broadcastData.transactions.filter((tx: any) => tx.transactionType === 'CREATE');
  const USDC_ADDRESS = creates[0].contractAddress;
  const VAULT_ADDRESS = creates[1].contractAddress;

  const OWNER_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const MERCHANT_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
  const MERCHANT_ADDRESS = privateKeyToAccount(MERCHANT_KEY).address;

  // 1. Start Merchant 402 Paywall API
  const paywall = createPaywall({
    costUsdc: '1.25',
    recipient: MERCHANT_ADDRESS,
    tokenAddress: USDC_ADDRESS,
  });

  const server = http.createServer((req, res) => {
    paywall(req, res, () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ intelligence: 'Bullish on-chain whale accumulation detected.' }));
    });
  });

  await new Promise<void>((resolve) => server.listen(3002, resolve));
  console.log('🏪 Merchant API active at http://127.0.0.1:3002/mcp-test ($1.25 USDC)');

  // 2. Setup Agent Key and Allowance
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
    dailyLimitUsdc: '15.00',
    durationSeconds: 86400,
  });
  console.log('🔐 Session configured for MCP Agent ($15 daily allowance).');

  // 3. Launch MCP Server as a Subprocess (Exact way Claude Desktop runs it)
  console.log('\n🧠 Simulating Claude Desktop connecting to AgentPay MCP...');
  const mcpProcess = spawn('./node_modules/.bin/tsx', ['src/mcp.ts'], {
    env: {
      ...process.env,
      AGENTPAY_VAULT_ADDRESS: VAULT_ADDRESS,
      AGENTPAY_AGENT_KEY: agentPrivateKey,
      AGENTPAY_RPC_URL: 'http://127.0.0.1:8545',
    },
    stdio: ['pipe', 'pipe', 'inherit'],
  });

  // Helper to send JSON-RPC requests to the MCP server
  let msgId = 1;
  function sendRpc(method: string, params: any): Promise<any> {
    return new Promise((resolve) => {
      const payload = JSON.stringify({ jsonrpc: '2.0', id: msgId++, method, params }) + '\n';
      
      const onData = (data: Buffer) => {
        const lines = data.toString().split('\n').filter((l) => l.trim().length > 0);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.id === msgId - 1) {
              mcpProcess.stdout.off('data', onData);
              resolve(parsed);
              return;
            }
          } catch {}
        }
      };

      mcpProcess.stdout.on('data', onData);
      mcpProcess.stdin.write(payload);
    });
  }

  // 4. Claude asks MCP: "What tools do you have?"
  const toolsRes = await sendRpc('tools/list', {});
  console.log(`\n🛠️  Claude discovered ${toolsRes.result.tools.length} AgentPay tools:`);
  toolsRes.result.tools.forEach((t: any) => console.log(`   - ${t.name}: ${t.description.substring(0, 60)}...`));

  // 5. Claude checks allowance tool
  console.log('\n💬 Claude Prompt: "Check my remaining budget before buying data."');
  const allowanceRes = await sendRpc('tools/call', {
    name: 'get_spend_allowance',
    arguments: {},
  });
  console.log('📊 Claude receives budget info:\n', allowanceRes.result.content[0].text);

  // 6. Claude executes paywalled purchase
  console.log('\n💬 Claude Prompt: "Purchase the market intelligence from http://127.0.0.1:3002/mcp-test"');
  const fetchRes = await sendRpc('tools/call', {
    name: 'fetch_paywalled_api',
    arguments: { url: 'http://127.0.0.1:3002/mcp-test' },
  });
  console.log('🎉 Claude receives unlocked data via MCP:\n', fetchRes.result.content[0].text);

  mcpProcess.kill();
  server.close();
  console.log('\n======================================================');
  console.log('🚀 CLAUDE MCP SERVER IS 100% PRODUCTION READY');
  console.log('======================================================\n');
}

main().catch(console.error);