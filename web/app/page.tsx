'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'client' | 'middleware'>('client');
  const [allowance, setAllowance] = useState(15);
  const [status, setStatus] = useState<'idle' | 'running' | 'success'>('idle');

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install @agentpay/sdk viem');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    setStatus('running');
    setTimeout(() => setStatus('success'), 1800);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 bg-dot-pattern selection:bg-zinc-800 selection:text-white">
      
      {/* 1. TOP PROTOCOL TICKER */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/80 px-6 py-2 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base L2 Settlement</span>
            </span>
            <span className="text-zinc-700">/</span>
            <span>Standard: <span className="text-zinc-200">x402 v2</span></span>
            <span className="hidden sm:inline text-zinc-700">/</span>
            <span className="hidden sm:inline">Finality: <span className="text-zinc-200">Sub-second Flashblocks</span></span>
          </div>
          <span className="text-zinc-500 hidden sm:inline">Non-Custodial Architecture</span>
        </div>
      </div>

      {/* 2. NAVIGATION */}
      <header className="border-b border-zinc-800/60 sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs">
              AP
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-100">AgentPay</span>
            <Badge variant="outline" className="ml-1 text-[9px] text-zinc-400">Base Mainnet Ready</Badge>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/Web3Manuel001/agentpay" 
              target="_blank" 
              className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition flex items-center space-x-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <Button variant="default" size="sm" asChild>
              <a href="#demo">Launch Protocol</a>
            </Button>
          </div>
        </div>
      </header>

      {/* 3. HERO: NATIVE SHADCN MONOCHROME */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-xs mb-8">
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">New</Badge>
          <span className="text-zinc-400">Official x402 v2 Settlement Engine</span>
          <ChevronRight className="w-3 h-3 text-zinc-500" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 leading-[1.08] mb-6">
          The Monetary Spine for <br />
          <span className="text-zinc-400 font-medium">Autonomous AI Agents</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Cryptographically enforced daily allowances, ephemeral session keys, and sub-cent on-chain micro-settlements for AI software on Base.
        </p>

        {/* INSTALLATION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-16">
          <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs shadow-inner">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-zinc-600">$</span>
              <span>npm install @agentpay/sdk</span>
            </div>
            <Button variant="ghost" size="icon" onClick={copyInstall} className="h-6 w-6 shrink-0 text-zinc-400">
              {copied ? <Check className="w-3.5 h-3.5 text-zinc-100" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
          <Button variant="default" className="w-full sm:w-auto h-10 px-5 text-xs font-semibold" asChild>
            <a href="#demo">View Terminal</a>
          </Button>
        </div>

        {/* 4 CARDS: MONOCHROME ASH */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <Card className="bg-zinc-950/60 border-zinc-800/80">
            <CardHeader className="p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Settlement Cost</span>
              <div className="text-lg font-bold font-mono text-zinc-100">&lt; $0.002</div>
              <span className="text-[11px] text-zinc-500">Fixed USDC Base gas</span>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-950/60 border-zinc-800/80">
            <CardHeader className="p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Session Key Auth</span>
              <div className="text-lg font-bold font-mono text-zinc-100">Guarded</div>
              <span className="text-[11px] text-zinc-500">Zero master key exposure</span>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-950/60 border-zinc-800/80">
            <CardHeader className="p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Protocol Spec</span>
              <div className="text-lg font-bold font-mono text-zinc-100">x402 v2</div>
              <span className="text-[11px] text-zinc-500">Linux Foundation standard</span>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-950/60 border-zinc-800/80">
            <CardHeader className="p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Interface</span>
              <div className="text-lg font-bold font-mono text-zinc-100">Claude MCP</div>
              <span className="text-[11px] text-zinc-500">Model Context Protocol</span>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 4. INTERACTIVE SIMULATION */}
      <section id="demo" className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">Execution Deck</Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
            Smart Vault Policy Simulation
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Test on-chain spend allowances and x402 HTTP challenge negotiation.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-5">
          <Card className="md:col-span-5 bg-zinc-950 border-zinc-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono">AgentVault.sol</CardTitle>
                <Badge variant="success">Active</Badge>
              </div>
              <CardDescription>Base Sepolia Verified Bytecode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Daily Allowance</span>
                  <span className="text-zinc-100 font-bold">${allowance}.00 USDC</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5" 
                  value={allowance}
                  onChange={(e) => setAllowance(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100"
                />
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>On-Chain Limit:</span>
                  <span className="text-zinc-200">${allowance}.00</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>Spent 24h:</span>
                  <span className="text-zinc-200">{status === 'success' ? '$1.50' : '$0.00'}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>TTL Expiry:</span>
                  <span className="text-zinc-200">23h 59m</span>
                </div>
              </div>

              <Button 
                onClick={handleSimulate} 
                disabled={status === 'running'} 
                className="w-full text-xs font-semibold"
              >
                {status === 'running' ? 'Broadcasting to Base...' : 'Dispatch AlphaScout Query'}
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-7 bg-zinc-950 border-zinc-800 overflow-hidden font-mono text-xs">
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>telemetry.log</span>
              </div>
              <span>CAIP-2 eip155:8453</span>
            </div>
            <CardContent className="p-4 space-y-2.5 min-h-[220px]">
              <div className="text-zinc-600">// Ready. Awaiting autonomous agent execution.</div>

              {status !== 'idle' && (
                <div className="text-zinc-300">
                  <span className="text-zinc-500">&gt;</span> Agent query dispatched: &quot;Audit Base whale flows&quot;
                </div>
              )}

              {status !== 'idle' && (
                <div className="text-zinc-400 text-[11px] bg-zinc-900/60 p-2 rounded border border-zinc-800">
                  [HTTP 402] Server Challenge: PAYMENT-REQUIRED ($1.50 USDC)
                </div>
              )}

              {status === 'success' && (
                <div className="text-zinc-200 text-[11px] bg-zinc-900/60 p-2 rounded border border-zinc-800 space-y-1">
                  <div className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Settlement Confirmed on Base</span>
                  </div>
                  <div className="text-zinc-500 text-[10px] truncate">
                    Tx: 0x38c5179e8150c8cb24d8c52d747e39118a049334660f26100d1ae6e16fe6ea70
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="text-[11px] text-zinc-300 pt-1 font-sans">
                  <strong>Result:</strong> $6.7M institutional liquidity deployed to Base Aerodrome pools.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. CODE TABS */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Badge variant="outline">Developer Surface</Badge>
            <h3 className="text-lg font-bold text-zinc-100 mt-1">TypeScript Integration</h3>
          </div>
          <div className="flex p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono">
            <button 
              onClick={() => setTab('client')} 
              className={`px-2.5 py-1 rounded ${tab === 'client' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Agent Client
            </button>
            <button 
              onClick={() => setTab('middleware')} 
              className={`px-2.5 py-1 rounded ${tab === 'middleware' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              x402 Middleware
            </button>
          </div>
        </div>

        <Card className="bg-zinc-950 border-zinc-800 overflow-hidden font-mono text-xs">
          <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/30 text-[11px] text-zinc-500">
            {tab === 'client' ? 'agent-client.ts' : 'x402-server.ts'}
          </div>
          <pre className="p-4 text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
            <code>
              {tab === 'client' ? (
`import { AgentPay } from '@agentpay/sdk';

// Initialize with non-custodial session key
const agent = new AgentPay({
  privateKey: process.env.EPHEMERAL_AGENT_KEY,
  vaultAddress: '0x_vault_on_base',
});

// Autonomous x402 v2 negotiation & settlement
const { data, costPaid, txHash } = await agent.fetchWithPayment(
  'https://api.marketdata.eth/v1/whales'
);`
              ) : (
`import { createX402Paywall } from '@agentpay/sdk/middleware';

// Gating REST endpoints with HTTP 402 on Base
const paywall = createX402Paywall({
  costUsdc: '1.50',
  recipient: '0x_merchant_address',
  tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
  networkId: 'eip155:8453',
});`
              )}
            </code>
          </pre>
        </Card>
      </section>

      {/* 6. MINIMALIST FOOTER */}
      <footer className="border-t border-zinc-800/80 py-10 text-xs font-mono text-zinc-500">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
            <span className="font-semibold text-zinc-100">AgentPay Protocol</span>
          </div>
          <div>MIT Open Source · Built on Base</div>
          <div className="flex space-x-3">
            <a href="https://github.com/Web3Manuel001/agentpay" target="_blank" className="hover:text-zinc-200 transition">GitHub</a>
            <a href="https://base.org" target="_blank" className="hover:text-zinc-200 transition">Base</a>
            <a href="https://x402.org" target="_blank" className="hover:text-zinc-200 transition">x402</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
