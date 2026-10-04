'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Terminal, 
  Cpu, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronRight, 
  Lock, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'agent' | 'middleware'>('agent');
  const [allowance, setAllowance] = useState(15);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install @agentpay/sdk viem');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateRun = () => {
    setIsExecuting(true);
    setExecutionStep(1);
    setTimeout(() => setExecutionStep(2), 700);
    setTimeout(() => setExecutionStep(3), 1400);
    setTimeout(() => setExecutionStep(4), 2100);
    setTimeout(() => setIsExecuting(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] bg-grid selection:bg-blue-500/20 selection:text-blue-300">
      
      {/* 1. TOP PROTOCOL TELEMETRY BAR */}
      <div className="border-b border-white/[0.06] bg-[#0c0c0e]/80 backdrop-blur-md px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base L2: Operational</span>
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline">Block Latency: <span className="text-zinc-200">Flashblocks (200ms)</span></span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline">Protocol Standard: <span className="text-zinc-200">x402 v2</span></span>
          </div>
          <div className="flex items-center space-x-3 text-zinc-300">
            <span>Avg Tx Fee: <span className="text-emerald-400">$0.0018</span></span>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <nav className="border-b border-white/[0.06] sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#09090b] rounded-[7px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm tracking-tight text-white">AgentPay</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-400 font-mono">v0.1.0</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-medium text-zinc-400">
            <a href="#architecture" className="hover:text-white transition">Architecture</a>
            <a href="#playground" className="hover:text-white transition">Interactive Demo</a>
            <a 
              href="https://github.com/Web3Manuel001/agentpay" 
              target="_blank" 
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08] transition flex items-center space-x-1.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-300 text-xs mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span className="font-medium">Programmable Financial Rails for Autonomous Agents</span>
          <ChevronRight className="w-3 h-3 text-zinc-500" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
          The Monetary Spine for the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">
            Machine-to-Machine Economy
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Non-custodial session policies, deterministic spend limits, and instant sub-cent 
          <code className="mx-1.5 px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-200 font-mono text-sm">x402 v2</code> 
          settlements for autonomous agents on Base.
        </p>

        {/* INSTALL COMMAND BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-16">
          <button 
            onClick={copyInstall}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#121214] border border-white/[0.08] text-zinc-300 font-mono text-xs hover:border-white/[0.16] transition group shadow-2xl"
          >
            <div className="flex items-center space-x-2">
              <span className="text-zinc-600">$</span>
              <span>npm install @agentpay/sdk</span>
            </div>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition" />
            )}
          </button>
          
          <a 
            href="#playground" 
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition flex items-center justify-center space-x-1 shrink-0"
          >
            <span>Launch Demo</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-white/[0.06] bg-[#0c0c0e]/60 text-left">
          <div className="p-3">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Settlement Cost</span>
            <p className="text-xl font-bold text-white mt-1 font-mono">&lt; $0.002</p>
            <span className="text-[11px] text-zinc-400">99% cheaper than Stripe</span>
          </div>
          <div className="p-3 border-l border-white/[0.06]">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Session Key Security</span>
            <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">100% Guarded</p>
            <span className="text-[11px] text-zinc-400">Daily limit enforced on-chain</span>
          </div>
          <div className="p-3 border-l border-white/[0.06]">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Standard</span>
            <p className="text-xl font-bold text-white mt-1 font-mono">x402 v2</p>
            <span className="text-[11px] text-zinc-400">Linux Foundation compliant</span>
          </div>
          <div className="p-3 border-l border-white/[0.06]">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Network</span>
            <p className="text-xl font-bold text-blue-400 mt-1 font-mono">Base L2</p>
            <span className="text-[11px] text-zinc-400">Coinbase ecosystem native</span>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PRODUCT PLAYGROUND */}
      <section id="playground" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Interactive Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Simulate Autonomous x402 Execution
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Watch AlphaScout encounter an HTTP 402 paywall, sign an on-chain transaction from the vault, and decrypt intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: POLICY CONTROLS */}
          <div className="lg:col-span-5 p-5 rounded-2xl border border-white/[0.08] bg-[#0f0f12] space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Smart Contract Guardrail</span>
                <h3 className="text-sm font-semibold text-white mt-0.5">AgentVault.sol</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active Policy
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-400">Daily Spend Allowance</span>
                  <span className="font-mono text-white font-bold">${allowance}.00 USDC</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5" 
                  value={allowance}
                  onChange={(e) => setAllowance(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-600 mt-1">
                  <span>$5</span>
                  <span>$25</span>
                  <span>$50</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.04] space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Vault Balance:</span>
                  <span className="text-white">1,000.00 USDC</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Max Transaction:</span>
                  <span className="text-zinc-300">5.00 USDC</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Session Expiry:</span>
                  <span className="text-zinc-300">23h 58m</span>
                </div>
              </div>

              <button
                disabled={isExecuting}
                onClick={simulateRun}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'Agent Transacting On-Chain...' : 'Dispatch AlphaScout Agent'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: LIVE EXECUTION CONSOLE */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0c0c0e] overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-white/[0.06] bg-[#09090b] flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>agent-runtime-console.log</span>
              </div>
              <span className="text-[10px] text-zinc-500">Node v24 · Viem</span>
            </div>

            <div className="p-5 font-mono text-xs space-y-3 min-h-[320px]">
              <div className="text-zinc-500">// Ready. Click Dispatch to trigger autonomous settlement.</div>
              
              {executionStep >= 1 && (
                <div className="text-zinc-300 flex items-start space-x-2">
                  <span className="text-blue-400 font-bold">&gt;</span>
                  <span>Agent dispatched: &quot;Audit Base whale flows and liquidity rebalance&quot;</span>
                </div>
              )}

              {executionStep >= 2 && (
                <div className="p-3 rounded-lg bg-yellow-500/[0.06] border border-yellow-500/20 text-yellow-300 space-y-1">
                  <div className="font-semibold flex items-center space-x-1.5">
                    <span>💳 HTTP 402 Payment Required</span>
                  </div>
                  <div className="text-[11px] text-yellow-300/80">
                    Endpoint: api.base-analytics.eth/v1/whales | Price: $1.50 USDC
                  </div>
                </div>
              )}

              {executionStep >= 3 && (
                <div className="p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-emerald-300 space-y-1">
                  <div className="font-semibold flex items-center space-x-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>AgentVault Settled on Base (eip155:8453)</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80 break-all">
                    Tx: 0x38c5179e8150c8cb24d8c52d747e39118a049334660f26100d1ae6e16fe6ea70
                  </div>
                </div>
              )}

              {executionStep >= 4 && (
                <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-zinc-200 space-y-2">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    📋 Decrypted AlphaScout Dossier
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    <strong>Whale Activity Detected:</strong> $6.7M in institutional USDC liquidity added to Aerodrome L2 pools. Network gas remains ultra-low at 0.002 gwei.
                  </p>
                  <div className="text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/[0.04]">
                    Cryptographic Proof: Validated on-chain · Zero master key exposure
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 5. CODE SHOWCASE: DEVELOPER TAB */}
      <section id="architecture" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Developer SDK</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Engineered for Zero Overhead
            </h2>
          </div>

          <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] self-start font-mono text-xs">
            <button
              onClick={() => setActiveTab('agent')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'agent' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
            >
              Agent Client
            </button>
            <button
              onClick={() => setActiveTab('middleware')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'middleware' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'}`}
            >
              x402 Server Middleware
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e] overflow-hidden shadow-2xl">
          <div className="px-5 py-3 border-b border-white/[0.06] bg-[#09090b] flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>{activeTab === 'agent' ? 'agent-fetch.ts' : 'server-paywall.ts'}</span>
            <span className="text-[10px] text-zinc-500">TypeScript · Viem</span>
          </div>
          <pre className="p-6 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
            <code>
              {activeTab === 'agent' ? (
`import { AgentPay } from '@agentpay/sdk';

// 1. Initialize agent with ephemeral restricted session key
const agent = new AgentPay({
  privateKey: '0x_ephemeral_agent_key',
  vaultAddress: '0x_vault_on_base',
  rpcUrl: 'https://mainnet.base.org',
});

// 2. Fetch from any x402-gated API.
// Handles PAYMENT-REQUIRED handshake & Base settlement automatically
const { data, costPaid, txHash } = await agent.fetchWithPayment(
  'https://api.marketdata.com/v1/alpha'
);

console.log(\`Unlocked data for $\${costPaid} USDC. Tx: \${txHash}\`);`
              ) : (
`import { createX402Paywall } from '@agentpay/sdk/middleware';
import http from 'http';

// Protect any REST API endpoint with 3 lines of code
const paywall = createX402Paywall({
  costUsdc: '0.10',
  recipient: '0x_merchant_address',
  tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
  networkId: 'eip155:8453',
});

// Serves HTTP 402 challenge or delivers payload upon on-chain verification
const server = http.createServer((req, res) => {
  paywall(req, res, () => {
    res.end(JSON.stringify({ premiumAlpha: 'Delivered.' }));
  });
});`
              )}
            </code>
          </pre>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 text-center text-zinc-500 text-xs font-mono">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-semibold text-white">AgentPay Protocol</span>
            <span>· Built on Base</span>
          </div>
          <p>MIT Licensed · Open Source Autonomous Finance</p>
          <div className="flex space-x-4">
            <a href="https://github.com/Web3Manuel001/agentpay" target="_blank" className="hover:text-white transition">GitHub</a>
            <a href="https://base.org" target="_blank" className="hover:text-white transition">Base</a>
            <a href="https://x402.org" target="_blank" className="hover:text-white transition">x402</a>
          </div>
        </div>
      </footer>

    </div>
  );
}