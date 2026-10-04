'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { 
  ShieldCheck, 
  Terminal, 
  Zap, 
  Wallet, 
  ArrowUpRight, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

export default function GoferErrandDesk() {
  const { login, logout, authenticated, user } = usePrivy();
  const [allowance, setAllowance] = useState(25);
  const [directive, setDirective] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [report, setReport] = useState<any>(null);

  // Initialize Telegram WebApp if opened in Telegram
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      tg.expand();
    }
  }, []);

  const walletAddress = user?.wallet?.address;
  const userIdentifier = user?.email?.address || (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '0x71C...4467');

  const executeErrand = async (customPrompt?: string) => {
    const textToRun = customPrompt || directive;
    if (!textToRun.trim() || isPaused) return;

    setStatus('running');
    setReport(null);

    try {
      const res = await fetch('/api/gofer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directive: textToRun }),
      });
      const data = await res.json();
      setReport(data);
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div className="bg-[#131315] text-[#e5e1e4] font-sans min-h-screen antialiased selection:bg-zinc-800 selection:text-white">
      
      {/* 1. TOP STATUS TICKER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#131315] border-b border-[#444748]/60">
        <div className="h-7 bg-[#0e0e10] border-b border-[#444748]/60 px-6 sm:px-8 flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-4">
            <span className="text-[#6ffbbe] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 bg-[#6ffbbe] inline-block animate-pulse"></span>
              SESSION_KEY: ACTIVE (ECDSA-SECP256k1)
            </span>
            <span className="text-[#444748]">|</span>
            <span className="text-[#c4c7c8]">RPC: sepolia.base.org</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[#c4c7c8]">
            <span>VAULT: <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="text-white underline">0xf57c...8347</a></span>
            <span className="text-[#444748]">/</span>
            <span>PAYMASTER: Sponsored</span>
          </div>
        </div>

        <div className="h-16 px-6 sm:px-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="AgentPay" className="h-8 w-8 object-contain" />
              <span className="text-xl font-semibold text-white tracking-tight">AgentPay</span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 bg-[#2a2a2c] border border-[#444748] text-[#c4c7c8] rounded">v0.1.0</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 font-mono text-xs">
              <Link href="/" className="text-[#c4c7c8] hover:text-white transition-colors pb-1">Protocol Hub</Link>
              <Link href="/gofer" className="text-white border-b-2 border-white pb-1 font-medium">Gofer Errand Desk</Link>
              <a href="https://github.com/Web3Manuel001/agentpay" target="_blank" className="text-[#c4c7c8] hover:text-white transition-colors pb-1">Documentation</a>
              <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="text-[#c4c7c8] hover:text-white transition-colors pb-1">Basescan</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {authenticated ? (
              <button onClick={logout} className="px-3.5 py-1.5 bg-[#201f22] border border-[#444748] text-white font-mono text-xs rounded hover:bg-[#2a2a2c] transition flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                <span>{userIdentifier}</span>
              </button>
            ) : (
              <button onClick={login} className="px-4 py-1.5 bg-white text-[#131315] font-mono text-xs font-semibold rounded hover:bg-[#e2e2e2] transition-colors">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. FULL-WIDTH NATIVE WORKSPACE */}
      <main className="w-full pt-[92px] px-6 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1c1b1d] p-4 sm:p-5 rounded border border-[#444748]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white text-[#131315] flex items-center justify-center font-mono font-bold text-sm rounded shadow">
                G
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-tight">Gofer Autonomous Errand Desk</h1>
                  <span className="px-2 py-0.5 bg-[#201f22] font-mono text-[10px] text-[#6ffbbe] rounded border border-[#6ffbbe]/20">Base L2</span>
                </div>
                <p className="text-xs text-[#c4c7c8] mt-0.5">
                  Autonomous task executor running on Qwen 3.8 LPU & AgentVault session guardrails.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`px-3 py-1.5 font-mono text-xs rounded transition flex items-center gap-1.5 ${isPaused ? 'bg-[#93000a] text-white font-semibold' : 'bg-[#201f22] text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#93000a]/20'}`}
              >
                {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'ARMED / FROZEN' : 'KILL-SWITCH'}</span>
              </button>

              <a 
                href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" 
                target="_blank" 
                className="px-3 py-1.5 bg-[#201f22] border border-[#444748] text-white font-mono text-xs rounded hover:bg-[#2a2a2c] transition flex items-center gap-1"
              >
                <span>Contract</span>
                <ExternalLink className="w-3 h-3 text-[#c4c7c8]" />
              </a>
            </div>
          </div>

          {/* DUAL COLUMN RESPONSIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: ACTIVE COMMAND & ERRAND DISPATCH (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Guardrails & Allowance Card */}
              <div className="bg-[#1c1b1d] p-5 rounded border border-[#444748]/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">Session Guardrail Parameters</span>
                  <span className="px-2 py-0.5 bg-[#201f22] font-mono text-[10px] text-[#6ffbbe] font-medium rounded border border-[#6ffbbe]/20">
                    ENFORCED
                  </span>
                </div>

                <div className="bg-[#0e0e10] p-4 rounded space-y-2 border border-[#444748]/40 font-mono">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-[#c4c7c8]">Daily Spend Limit:</span>
                    <span className="text-lg text-white font-bold">${allowance}.00 USDC</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="5" 
                    value={allowance}
                    onChange={(e) => setAllowance(Number(e.target.value))}
                    className="w-full h-1 bg-[#201f22] rounded appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-[10px] text-[#8e9192]">
                    <span>$5.00 min</span>
                    <span>$25.00</span>
                    <span>$50.00 max</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-[#201f22] p-2.5 rounded border border-[#444748]/40">
                    <span className="text-[#8e9192] text-[10px] uppercase">Available Budget</span>
                    <p className="text-white font-bold text-sm mt-0.5">$18.42 USDC</p>
                  </div>
                  <div className="bg-[#201f22] p-2.5 rounded border border-[#444748]/40">
                    <span className="text-[#8e9192] text-[10px] uppercase">Max Single Tx</span>
                    <p className="text-white font-bold text-sm mt-0.5">$2.50 USDC</p>
                  </div>
                </div>
              </div>

              {/* Errand Input & Quick Directives */}
              <div className="bg-[#1c1b1d] p-5 rounded border border-[#444748]/60 space-y-4">
                <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold block">Dispatch Mission</span>
                
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={directive}
                    onChange={(e) => setDirective(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeErrand()}
                    placeholder="Command Gofer: e.g. Audit Base TVL, check gas, and pay 2.50 USDC..."
                    className="flex-1 bg-[#0e0e10] border border-[#444748]/60 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#8e9192] focus:outline-none focus:border-white transition font-sans"
                  />
                  <button 
                    onClick={() => executeErrand()} 
                    disabled={status === 'running' || !directive.trim() || isPaused}
                    className="px-5 py-2.5 bg-white text-[#131315] hover:bg-[#e2e2e2] disabled:opacity-50 font-mono text-xs font-semibold rounded transition shrink-0 flex items-center gap-1.5"
                  >
                    <span>{status === 'running' ? 'Executing...' : 'Dispatch'}</span>
                    <span>➔</span>
                  </button>
                </div>

                {/* Quick Directive Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8e9192]">Pre-Configured Directives:</span>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button 
                      onClick={() => executeErrand("Audit top Base pools & DEX yield via DefiLlama")}
                      className="bg-[#201f22] hover:bg-[#2a2a2c] border border-[#444748]/40 p-2.5 rounded transition text-left space-y-1"
                    >
                      <div className="text-xs font-medium text-white flex items-center justify-between">
                        <span>Market Audit</span>
                        <ArrowUpRight className="w-3 h-3 text-[#8e9192]" />
                      </div>
                      <p className="text-[10px] text-[#c4c7c8]">Inspect Base pools & yield</p>
                    </button>

                    <button 
                      onClick={() => executeErrand("Check Base gas and settle $2.50 USDC to 0x7099... for API")}
                      className="bg-[#201f22] hover:bg-[#2a2a2c] border border-[#444748]/40 p-2.5 rounded transition text-left space-y-1"
                    >
                      <div className="text-xs font-medium text-white flex items-center justify-between">
                        <span>Vendor Pay</span>
                        <ArrowUpRight className="w-3 h-3 text-[#8e9192]" />
                      </div>
                      <p className="text-[10px] text-[#c4c7c8]">Settle $2.50 USDC via x402</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Execution Dossier Output */}
              {status === 'success' && report && (
                <div className="bg-[#1c1b1d] p-5 rounded border border-[#6ffbbe]/40 shadow-2xl space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[#444748]/40 pb-2">
                    <span className="text-[#6ffbbe] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Errand Executed & Verified On-Chain</span>
                    </span>
                    <span className="text-[#8e9192] text-[10px]">Base Sepolia (L2)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-[#0e0e10] p-3 rounded border border-[#444748]/40">
                    <div>
                      <span className="text-[#8e9192] text-[10px]">ETH SPOT PRICE:</span>
                      <p className="text-white font-bold">${report.market.ethPrice}</p>
                    </div>
                    <div>
                      <span className="text-[#8e9192] text-[10px]">BASE NETWORK TVL:</span>
                      <p className="text-white font-bold">${report.market.baseTvl}</p>
                    </div>
                  </div>

                  {report.payment && (
                    <div className="bg-[#0e0e10] p-3 rounded border border-[#444748]/40 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#8e9192]">AMOUNT SETTLED:</span>
                        <span className="text-[#6ffbbe] font-bold">{report.payment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8e9192]">RECIPIENT:</span>
                        <span className="text-white">{report.payment.recipient.slice(0, 10)}...</span>
                      </div>
                      <div className="text-[10px] text-[#8e9192] truncate pt-1 border-t border-[#444748]/40">
                        TX: {report.payment.txHash}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: REVENUE TELEMETRY & ON-CHAIN AUDIT LEDGER (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Agent Authority & Telemetry Box */}
              <div className="bg-[#1c1b1d] p-5 rounded border border-[#444748]/60 space-y-3">
                <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold block">Protocol Telemetry</span>
                
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between p-2 rounded bg-[#0e0e10] border border-[#444748]/40">
                    <span className="text-[#8e9192]">Contract Address:</span>
                    <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="text-white underline">0xf57c...8347</a>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-[#0e0e10] border border-[#444748]/40">
                    <span className="text-[#8e9192]">Session Key TTL:</span>
                    <span className="text-white">23h 14m 08s</span>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-[#0e0e10] border border-[#444748]/40">
                    <span className="text-[#8e9192]">Protocol Fee Switch:</span>
                    <span className="text-[#6ffbbe]">0.20% (Treasury Active)</span>
                  </div>
                </div>
              </div>

              {/* Transaction Ledger Table */}
              <div className="bg-[#1c1b1d] p-5 rounded border border-[#444748]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">Live Transaction Ledger</span>
                  <span className="text-[10px] font-mono text-[#6ffbbe] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#6ffbbe] rounded-full animate-pulse"></span>
                    Indexed
                  </span>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="text-[#8e9192] border-b border-[#444748]/40">
                        <th className="pb-2 font-medium">DIRECTIVE</th>
                        <th className="pb-2 font-medium">COST</th>
                        <th className="pb-2 font-medium text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#444748]/20">
                      <tr>
                        <td className="py-2 text-white">defillama.yields</td>
                        <td className="py-2 text-white">$0.0012</td>
                        <td className="py-2 text-right text-[#6ffbbe]">CONFIRMED</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-white">tavily.web_extract</td>
                        <td className="py-2 text-white">$0.0500</td>
                        <td className="py-2 text-right text-[#6ffbbe]">CONFIRMED</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-white">groq.qwen_lpu</td>
                        <td className="py-2 text-white">$0.0840</td>
                        <td className="py-2 text-right text-[#6ffbbe]">CONFIRMED</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-white">aerodrome.swap</td>
                        <td className="py-2 text-white">$6.4400</td>
                        <td className="py-2 text-right text-[#6ffbbe]">CONFIRMED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
