'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

export default function GoferErrandDesk() {
  const { login, logout, authenticated, user } = usePrivy();
  const [allowance, setAllowance] = useState(25);
  const [directive, setDirective] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const walletAddress = user?.wallet?.address;
  const userIdentifier = user?.email?.address || (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '0x71C...4467');

  const executeQuickDirective = (text: string) => {
    setDirective(text);
  };

  return (
    <div className="bg-[#131315] text-[#e5e1e4] font-sans min-h-screen antialiased selection:bg-zinc-800 selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#131315] border-b border-[#444748]/60">
        <div className="h-7 bg-[#0e0e10] border-b border-[#444748]/60 px-6 sm:px-8 flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-4">
            <span className="text-[#6ffbbe] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 bg-[#6ffbbe] inline-block animate-pulse"></span>
              SESSION_KEY: ACTIVE (ECDSA-SECP256k1)
            </span>
            <span className="text-[#444748]">|</span>
            <span className="text-[#c4c7c8]">RPC: base-sepolia.publicnode.com</span>
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
              <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="text-[#c4c7c8] hover:text-white transition-colors pb-1">Telemetry</a>
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
                Connect Agent
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. DUAL-PANE WORKSPACE */}
      <main className="w-full pt-[92px] px-6 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE TELEGRAM MINI APP (TMA) VIEWPORT (390 x 844) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="w-full max-w-[400px] flex items-center justify-between pb-2 font-mono text-[11px] text-[#c4c7c8]">
              <div className="flex items-center gap-1.5">
                <span>📱</span>
                <span>TELEGRAM MINI APP VIEWPORT</span>
              </div>
              <div className="flex items-center gap-2">
                <span>390 x 844</span>
                <span className="w-2 h-2 rounded-full bg-[#6ffbbe]"></span>
              </div>
            </div>

            {/* Mobile Device Frame */}
            <div className="w-full max-w-[400px] bg-[#0e0e10] border border-[#444748]/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              
              {/* TMA System Bar */}
              <div className="w-full bg-[#201f22] px-4 py-1.5 flex items-center justify-between font-mono text-[11px] text-[#c4c7c8] border-b border-[#444748]/40">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">9:41</span>
                  <span className="text-[10px] text-[#8e9192]">tg://agentpay/gofer</span>
                </div>
                <div className="flex items-center gap-1 text-white text-xs">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* App Sub-header */}
              <div className="w-full bg-[#1c1b1d] px-4 py-3 flex items-center justify-between border-b border-[#444748]/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-white text-[#131315] flex items-center justify-center font-mono font-bold text-xs rounded">
                    G
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">Gofer</span>
                      <span className="px-1.5 py-0.2 bg-[#201f22] font-mono text-[9px] text-[#6ffbbe] rounded border border-[#6ffbbe]/20">Base L2</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8e9192]">Consumer Agent Runtime</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#201f22] px-2.5 py-1 rounded border border-[#444748]/40 text-right">
                  <div className="flex flex-col font-mono text-[10px]">
                    <span className="text-white font-semibold">{userIdentifier}</span>
                    <span className="text-[#6ffbbe] font-bold">42.50 USDC</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Mini App Canvas */}
              <div className="p-4 space-y-4 bg-[#0e0e10]">
                
                {/* Guardrail Card with Slider */}
                <div className="bg-[#1c1b1d] p-3.5 rounded border border-[#444748]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white uppercase tracking-wider font-semibold">Session Guardrails</span>
                    <span className="px-2 py-0.5 bg-[#201f22] font-mono text-[10px] text-[#6ffbbe] font-medium rounded">ENFORCED</span>
                  </div>

                  <div className="bg-[#0e0e10] p-3 rounded space-y-1.5 border border-[#444748]/40 font-mono">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#c4c7c8]">Daily Cap:</span>
                      <span className="text-white font-bold">${allowance}.00 / day</span>
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
                      <span>$50.00 max</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center font-mono text-[11px] pt-1">
                    <span className="text-[#c4c7c8]">Remaining Today:</span>
                    <span className="text-white font-bold">$18.42 <span className="text-[#8e9192] font-normal">(73.6%)</span></span>
                  </div>
                </div>

                {/* Quick Directives Grid */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8e9192]">Quick Directives</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => executeQuickDirective("Audit top Base pools & DEX yield via DefiLlama")}
                      className="bg-[#1c1b1d] hover:bg-[#201f22] border border-[#444748]/40 p-2.5 rounded text-left transition flex flex-col justify-between h-[76px]"
                    >
                      <span className="font-medium text-xs text-white">Market Audit</span>
                      <p className="text-[10px] text-[#c4c7c8] leading-tight">Inspect Base pools & yield</p>
                    </button>

                    <button 
                      onClick={() => executeQuickDirective("Settle inference bill ($0.14 USDC via x402 stream)")}
                      className="bg-[#1c1b1d] hover:bg-[#201f22] border border-[#444748]/40 p-2.5 rounded text-left transition flex flex-col justify-between h-[76px]"
                    >
                      <span className="font-medium text-xs text-white">Vendor Pay</span>
                      <p className="text-[10px] text-[#c4c7c8] leading-tight">Settle $0.14 USDC via x402</p>
                    </button>

                    <button 
                      onClick={() => executeQuickDirective("Rebalance 10.0 USDC into cbBTC pool reserve")}
                      className="bg-[#1c1b1d] hover:bg-[#201f22] border border-[#444748]/40 p-2.5 rounded text-left transition flex flex-col justify-between h-[76px]"
                    >
                      <span className="font-medium text-xs text-white">Aerodrome Swap</span>
                      <p className="text-[10px] text-[#c4c7c8] leading-tight">Stage 10.0 USDC to cbBTC</p>
                    </button>

                    <button 
                      onClick={() => executeQuickDirective("Check live Base gas and audit token AERO")}
                      className="bg-[#1c1b1d] hover:bg-[#201f22] border border-[#444748]/40 p-2.5 rounded text-left transition flex flex-col justify-between h-[76px]"
                    >
                      <span className="font-medium text-xs text-white">Token Scout</span>
                      <p className="text-[10px] text-[#c4c7c8] leading-tight">Audit live on-chain AERO</p>
                    </button>
                  </div>
                </div>

                {/* Execution Terminal Feed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-mono text-[10px]">
                    <span className="uppercase text-[#8e9192]">Execution Stream</span>
                    <span className="text-[#6ffbbe] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#6ffbbe] rounded-full animate-pulse"></span>
                      STREAMING
                    </span>
                  </div>
                  <div className="w-full bg-[#09090b] p-3 rounded font-mono text-[10.5px] leading-relaxed text-[#c4c7c8] space-y-1 border border-[#444748]/40">
                    <div>[14:22:01] <span className="text-white font-medium">DISPATCH:</span> agent.call(&quot;defillama.yields&quot;) ➔ <span className="text-[#6ffbbe]">200 OK</span></div>
                    <div>[14:22:04] <span className="text-white font-medium">POLICY:</span> 0.0012 USDC &lt; $18.42 ➔ <span className="text-[#6ffbbe]">APPROVED</span></div>
                    <div>[14:22:05] <span className="text-white font-medium">x402:</span> Intercepted 402 ➔ EIP-712 Sig verified</div>
                    <div>[14:22:08] <span className="text-white font-medium">BASE_L2:</span> Block #21,849,208. <span className="underline">0x3d4...98e</span></div>
                  </div>
                </div>

                {/* Input Bar */}
                <div className="pt-1">
                  <div className="w-full bg-[#1c1b1d] p-1.5 rounded flex items-center gap-2 border border-[#444748]/60">
                    <input 
                      type="text"
                      value={directive}
                      onChange={(e) => setDirective(e.target.value)}
                      placeholder="Command Gofer agent..."
                      className="flex-1 bg-transparent px-2 text-xs text-white placeholder-[#8e9192] focus:outline-none"
                    />
                    <button className="w-7 h-7 bg-white text-[#131315] hover:bg-[#e2e2e2] flex items-center justify-center rounded font-bold text-xs shrink-0 transition">
                      ➔
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom Home Handle */}
              <div className="w-full bg-[#1c1b1d] py-2 flex items-center justify-center">
                <div className="w-24 h-1 bg-[#353437] rounded-full"></div>
              </div>

            </div>
          </div>

          {/* RIGHT: INSTITUTIONAL INSPECTOR & ON-CHAIN LEDGER */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Top Inspector Box */}
            <div className="bg-[#1c1b1d] p-6 rounded border border-[#444748]/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">Agent Authority & Policies</h2>
                    <span className="w-2 h-2 rounded-full bg-[#6ffbbe]"></span>
                  </div>
                  <p className="text-xs text-[#c4c7c8] mt-0.5">
                    Cryptographic delegation parameters governing client-side autonomous transactions.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-3 py-1.5 font-mono text-xs rounded transition flex items-center gap-1.5 ${isPaused ? 'bg-[#93000a] text-white' : 'bg-[#201f22] text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#93000a]/20'}`}
                  >
                    <span>{isPaused ? 'ARMED / FROZEN' : 'KILL-SWITCH'}</span>
                  </button>
                  <a 
                    href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347"
                    target="_blank"
                    className="px-3 py-1.5 bg-[#201f22] hover:bg-[#2a2a2c] text-white border border-[#444748] font-mono text-xs rounded transition flex items-center gap-1"
                  >
                    <span>Basescan</span>
                  </a>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="bg-[#201f22] p-3 rounded border border-[#444748]/40 space-y-1">
                  <span className="text-[11px] text-[#8e9192]">Key Expiration</span>
                  <div className="text-base font-bold text-white">23h 14m 08s</div>
                  <span className="text-[10px] text-[#6ffbbe]">TTL auto-renewal armed</span>
                </div>

                <div className="bg-[#201f22] p-3 rounded border border-[#444748]/40 space-y-1">
                  <span className="text-[11px] text-[#8e9192]">Allowed Origin APIs</span>
                  <div className="text-base font-bold text-white">14 Services</div>
                  <span className="text-[10px] text-[#8e9192]">DefiLlama, Coinbase, Aerodrome</span>
                </div>

                <div className="bg-[#201f22] p-3 rounded border border-[#444748]/40 space-y-1">
                  <span className="text-[11px] text-[#8e9192]">Settlement Contract</span>
                  <div className="text-base font-bold text-white">0xf57c...8347</div>
                  <span className="text-[10px] text-[#8e9192]">AgentVault on Base Sepolia</span>
                </div>
              </div>

              {/* Attestation Matrix */}
              <div className="bg-[#0e0e10] p-4 rounded font-mono text-xs border border-[#444748]/40 space-y-2">
                <div className="flex justify-between text-[#8e9192] text-[11px] border-b border-[#444748]/40 pb-1.5">
                  <span className="text-white font-semibold">SESSION KEY ATTESTATION</span>
                  <span>EIP-712 DOMAIN SEPARATOR: 0x41e0...c4</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#c4c7c8] text-[11px] pt-1">
                  <div><span className="text-[#8e9192]">Validator:</span> AgentVaultPolicyValidator</div>
                  <div><span className="text-[#8e9192]">Max Single Settlement:</span> $2.50 USDC</div>
                  <div><span className="text-[#8e9192]">Signer:</span> 0xB780...4467 (Owner)</div>
                  <div><span className="text-[#8e9192]">Fallback Action:</span> Revert &amp; Escalate</div>
                </div>
              </div>
            </div>

            {/* Bottom On-Chain Transaction Ledger */}
            <div className="bg-[#1c1b1d] p-6 rounded border border-[#444748]/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Autonomous Transaction Ledger</h3>
                  <span className="px-2 py-0.5 bg-[#201f22] font-mono text-[10px] text-[#c4c7c8] rounded">4 Recorded Today</span>
                </div>
                <div className="font-mono text-xs text-[#6ffbbe] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#6ffbbe] rounded-full"></span>
                  <span>Real-time indexing</span>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left font-mono text-xs min-w-[500px]">
                  <thead>
                    <tr className="bg-[#201f22] text-[#8e9192] border-b border-[#444748]/40">
                      <th className="py-2 px-3 font-medium">TIMESTAMP</th>
                      <th className="py-2 px-3 font-medium">DIRECTIVE</th>
                      <th className="py-2 px-3 font-medium">AMOUNT</th>
                      <th className="py-2 px-3 font-medium">TX HASH</th>
                      <th className="py-2 px-3 font-medium text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#444748]/20">
                    <tr className="hover:bg-[#201f22]/60 transition">
                      <td className="py-2.5 px-3 text-[#8e9192]">14:22:08</td>
                      <td className="py-2.5 px-3 text-white font-medium">defillama.yields</td>
                      <td className="py-2.5 px-3 text-white font-bold">$0.0012</td>
                      <td className="py-2.5 px-3 text-[#c4c7c8]">0x3d4f...98eb</td>
                      <td className="py-2.5 px-3 text-right text-[#6ffbbe] font-semibold">CONFIRMED</td>
                    </tr>
                    <tr className="hover:bg-[#201f22]/60 transition">
                      <td className="py-2.5 px-3 text-[#8e9192]">13:58:31</td>
                      <td className="py-2.5 px-3 text-white font-medium">tavily.web_extract</td>
                      <td className="py-2.5 px-3 text-white font-bold">$0.0500</td>
                      <td className="py-2.5 px-3 text-[#c4c7c8]">0x7a11...412c</td>
                      <td className="py-2.5 px-3 text-right text-[#6ffbbe] font-semibold">CONFIRMED</td>
                    </tr>
                    <tr className="hover:bg-[#201f22]/60 transition">
                      <td className="py-2.5 px-3 text-[#8e9192]">12:40:19</td>
                      <td className="py-2.5 px-3 text-white font-medium">groq.qwen_lpu</td>
                      <td className="py-2.5 px-3 text-white font-bold">$0.0840</td>
                      <td className="py-2.5 px-3 text-[#c4c7c8]">0x0b89...5ef2</td>
                      <td className="py-2.5 px-3 text-right text-[#6ffbbe] font-semibold">CONFIRMED</td>
                    </tr>
                    <tr className="hover:bg-[#201f22]/60 transition">
                      <td className="py-2.5 px-3 text-[#8e9192]">11:15:02</td>
                      <td className="py-2.5 px-3 text-white font-medium">aerodrome.pool_swap</td>
                      <td className="py-2.5 px-3 text-white font-bold">$6.4400</td>
                      <td className="py-2.5 px-3 text-[#c4c7c8]">0x918f...110e</td>
                      <td className="py-2.5 px-3 text-right text-[#6ffbbe] font-semibold">CONFIRMED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
