'use client';

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight,
  LogOut,
  User,
  Wallet
} from 'lucide-react';

export default function Home() {
  const { login, logout, authenticated, user } = usePrivy();
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'client' | 'middleware'>('client');
  const [allowance, setAllowance] = useState(25);
  const [directive, setDirective] = useState("Audit Base TVL, check ETH spot price, and pay 2.50 USDC for hosting.");
  const [status, setStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [report, setReport] = useState<any>(null);

  const walletAddress = user?.wallet?.address;
  const userIdentifier = user?.email?.address || (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : null);

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install @agentpay/sdk viem');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = async () => {
    setStatus('running');
    setReport(null);

    try {
      const res = await fetch('/api/gofer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directive }),
      });
      const data = await res.json();
      setReport(data);
      setStatus('success');

      // Save errand history to Supabase if authenticated
      if (authenticated && user) {
        await supabase.from('errands').insert([
          {
            user_id: user.id,
            wallet_address: walletAddress || 'embedded-wallet',
            directive,
            market_data: data.market,
            payment_tx: data.payment?.txHash || null,
            status: 'COMPLETED',
          },
        ]);
      }
    } catch {
      setStatus('idle');
    }
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
            <span>Identity: <span className="text-zinc-200">Privy Social Wallets</span></span>
            <span className="hidden sm:inline text-zinc-700">/</span>
            <span className="hidden sm:inline">Memory: <span className="text-zinc-200">Supabase Postgres</span></span>
          </div>
          <span className="text-zinc-500 hidden sm:inline">Non-Custodial Architecture</span>
        </div>
      </div>

      {/* 2. NAVIGATION WITH PRIVY AUTH */}
      <header className="border-b border-zinc-800/60 sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs">
              AP
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-100">AgentPay</span>
            <Badge variant="outline" className="ml-1 text-[9px] text-zinc-400">Base Mainnet Ready</Badge>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="https://github.com/Web3Manuel001/agentpay" 
              target="_blank" 
              className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition hidden sm:flex items-center space-x-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>

            {/* PRIVY AUTH BUTTON */}
            {authenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200">
                  <Wallet className="w-3 h-3 text-emerald-400" />
                  <span>{userIdentifier}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-zinc-400 hover:text-zinc-100">
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm" onClick={login} className="text-xs font-semibold">
                <span>Sign In with Google</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-300 text-xs mb-8">
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Live</Badge>
          <span className="text-zinc-400">Embedded Wallets & Autonomous Guardrails on Base</span>
          <ChevronRight className="w-3 h-3 text-zinc-500" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 leading-[1.08] mb-6">
          The Monetary Spine for <br />
          <span className="text-zinc-400 font-medium">Autonomous AI Agents</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Zero-seed-phrase social logins, deterministic daily allowances, and sub-cent on-chain micro-settlements for AI software on Base.
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
            <a href="#demo">Dispatch Errand</a>
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
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Embedded Auth</span>
              <div className="text-lg font-bold font-mono text-zinc-100">Social Login</div>
              <span className="text-[11px] text-zinc-500">Privy zero-seed-phrase</span>
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
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Persistent State</span>
              <div className="text-lg font-bold font-mono text-zinc-100">Postgres</div>
              <span className="text-[11px] text-zinc-500">Supabase memory layer</span>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE GOFER EXECUTION TERMINAL */}
      <section id="demo" className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">Gofer Execution Deck</Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
            Autonomous Financial Errand Terminal
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Dispatch an errand: Gofer queries DefiLlama, audits the vault, and executes payments on Base.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-5">
          {/* DIRECTIVE & ALLOWANCE CONTROLS */}
          <Card className="md:col-span-5 bg-zinc-950 border-zinc-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono">AgentVault Policy</CardTitle>
                <Badge variant="success">Active</Badge>
              </div>
              <CardDescription>On-Chain Guardrail Status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-[11px] text-zinc-400 font-mono mb-1.5 block">Mission Directive</label>
                <textarea 
                  rows={3}
                  value={directive}
                  onChange={(e) => setDirective(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 transition resize-none font-sans"
                />
              </div>

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

              <Button 
                onClick={handleExecute} 
                disabled={status === 'running'} 
                className="w-full text-xs font-semibold"
              >
                {status === 'running' ? 'Gofer Executing Tools...' : 'Send Gofer on Errand ⚡'}
              </Button>
            </CardContent>
          </Card>

          {/* REAL-TIME EXECUTIVE DOSSIER DISPLAY */}
          <Card className="md:col-span-7 bg-zinc-950 border-zinc-800 overflow-hidden font-mono text-xs">
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>gofer-executive-brief.md</span>
              </div>
              <span>Qwen 3.8 · Base L2</span>
            </div>
            <CardContent className="p-4 space-y-3 min-h-[260px]">
              {status === 'idle' && (
                <div className="text-zinc-600 font-sans text-xs">
                  // Awaiting mission dispatch. Click &quot;Send Gofer on Errand&quot; to execute live tools.
                </div>
              )}

              {status === 'running' && (
                <div className="space-y-2 text-zinc-400 animate-pulse text-[11px]">
                  <div>&gt; Qwen reasoning loop initiated on Groq LPU...</div>
                  <div>&gt; Dispatching get_institutional_market_data()...</div>
                  <div>&gt; Dispatching execute_outbound_payment()...</div>
                </div>
              )}

              {status === 'success' && report && (
                <div className="space-y-3 font-sans text-xs text-zinc-200">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mission Successfully Completed & Verified On-Chain</span>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800 space-y-1 text-[11px]">
                    <div className="text-zinc-400 font-mono font-semibold uppercase text-[10px]">Market Audit (DefiLlama)</div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">ETH Spot Price:</span>
                      <span className="text-zinc-100 font-mono">${report.market.ethPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Base Ecosystem TVL:</span>
                      <span className="text-zinc-100 font-mono">${report.market.baseTvl}</span>
                    </div>
                  </div>

                  {report.payment && (
                    <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800 space-y-1 text-[11px]">
                      <div className="text-zinc-400 font-mono font-semibold uppercase text-[10px]">Settled Payment</div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Amount:</span>
                        <span className="text-emerald-400 font-mono font-bold">{report.payment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Memo:</span>
                        <span className="text-zinc-200">{report.payment.memo}</span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 truncate pt-1 border-t border-zinc-800/80">
                        Tx: {report.payment.txHash}
                      </div>
                    </div>
                  )}

                  {authenticated && (
                    <div className="text-[10px] font-mono text-emerald-400/80 flex items-center space-x-1">
                      <span>✓ Synchronized with Supabase Memory</span>
                    </div>
                  )}
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
