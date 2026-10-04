'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

export default function ProtocolHub() {
  const { login, logout, authenticated, user } = usePrivy();
  const [tab, setTab] = useState<'sdk' | 'middleware'>('sdk');
  const [copied, setCopied] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(19842109);

  const walletAddress = user?.wallet?.address;
  const userIdentifier = user?.email?.address || (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock((prev) => prev + Math.floor(Math.random() * 2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install @agentpay/sdk @agentpay/x402');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#131315] text-[#e5e1e4] font-sans min-h-screen antialiased selection:bg-zinc-800 selection:text-white">
      
      {/* 1. FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#131315] border-b border-[#444748]/60">
        
        {/* Ticker Bar */}
        <div className="h-7 bg-[#0e0e10] border-b border-[#444748]/60 px-6 sm:px-8 flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#6ffbbe] inline-block animate-pulse"></span>
              <span className="text-white font-medium">Base L2 Settlement: Active</span>
            </div>
            <span className="text-[#444748]">|</span>
            <span className="text-[#c4c7c8]">x402 Protocol v2.1</span>
            <span className="text-[#444748]">|</span>
            <span className="text-[#c4c7c8]">Latency: <span className="text-white font-medium">194ms</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[#c4c7c8]">
            <span>BLOCK: #{currentBlock.toLocaleString()}</span>
            <span className="text-[#444748]">/</span>
            <span className="text-[#4edea3]">GAS: 0.001 GWEI</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="h-16 px-6 sm:px-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="AgentPay" className="h-8 w-8 object-contain" />
              <span className="text-xl font-semibold text-white tracking-tight">AgentPay</span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 bg-[#2a2a2c] border border-[#444748] text-[#c4c7c8] rounded">v0.1.0</span>
            </div>

            <nav className="hidden lg:flex items-center gap-6 font-mono text-xs">
              <Link href="/" className="text-white border-b-2 border-white pb-1 font-medium">Protocol Hub</Link>
              <Link href="/gofer" className="text-[#c4c7c8] hover:text-white transition-colors pb-1">Gofer Errand Desk</Link>
              <a href="https://github.com/Web3Manuel001/agentpay" target="_blank" className="text-[#c4c7c8] hover:text-white transition-colors pb-1">Documentation</a>
              <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="text-[#c4c7c8] hover:text-white transition-colors pb-1">Telemetry</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Web3Manuel001/agentpay" 
              target="_blank" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#444748] text-[#c4c7c8] hover:text-white hover:border-[#8e9192] font-mono text-xs rounded transition-all"
            >
              <span>GitHub</span>
            </a>

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

      {/* 2. HERO SECTION */}
      <main className="w-full pt-[92px]">
        
        {/* Micro Status Bar */}
        <section className="w-full bg-[#0e0e10] py-2 px-6 sm:px-8 border-b border-[#444748]/40">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
            <div className="flex items-center gap-4 overflow-x-auto">
              <span className="text-white bg-[#201f22] px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#6ffbbe] rounded-full animate-pulse"></span>
                Base L2 Settlement: Operational
              </span>
              <span className="text-[#444748]">/</span>
              <span>200ms Flashblocks Latency</span>
              <span className="text-[#444748]">/</span>
              <span>x402 v2 Protocol Spec Standardized</span>
            </div>
            <div className="text-[#c4c7c8]">
              Verified on Base Sepolia: <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="text-white underline">0xf57c...8347</a>
            </div>
          </div>
        </section>

        {/* Hero Title & Terminal Bar */}
        <section className="w-full px-6 sm:px-8 py-16 bg-[#131315]">
          <div className="max-w-5xl mx-auto flex flex-col items-start gap-6">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 bg-[#2a2a2c] text-white uppercase tracking-wider rounded">
                Autonomous On-Chain Value Transfer
              </span>
              <span className="text-[#8e9192]">RFC-9402 Compliance Engine</span>
            </div>

            <div className="flex flex-col gap-3 max-w-4xl">
              <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.08]">
                The Monetary Spine for Autonomous AI Agents
              </h1>
              <p className="text-base sm:text-lg text-[#c4c7c8] max-w-3xl leading-relaxed font-normal">
                AgentPay is an institutional x402 payment primitive built natively for LLMs, agent runtimes, and autonomous errand swarms on Base L2. Stream sub-cent micropayments, sign programmatic escrow, and settle compute API calls deterministically.
              </p>
            </div>

            {/* Copyable NPM Command Bar */}
            <div className="w-full max-w-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#0e0e10] p-2.5 rounded border border-[#444748]/60 shadow-xl">
              <div className="flex items-center gap-3 px-2 overflow-x-auto">
                <span className="text-[#8e9192] select-none font-mono text-sm">$</span>
                <code className="font-mono text-sm text-white font-medium tracking-tight whitespace-nowrap">
                  npm install @agentpay/sdk @agentpay/x402
                </code>
                <span className="bg-[#201f22] px-1.5 py-0.5 font-mono text-[10px] text-[#c4c7c8] rounded shrink-0">v0.1.0</span>
              </div>
              <div className="flex items-center gap-2 justify-end shrink-0">
                <button 
                  onClick={copyInstall}
                  className="bg-[#2a2a2c] hover:bg-[#353437] text-white font-mono text-xs px-3.5 py-1.5 rounded transition-all active:scale-95 uppercase tracking-wider font-medium"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                href="/gofer" 
                className="px-5 py-2.5 bg-white text-[#131315] font-mono text-xs font-semibold rounded hover:bg-[#e2e2e2] transition-all flex items-center gap-2 shadow-lg shadow-white/5"
              >
                <span>Launch Gofer Errand Desk</span>
                <span>➔</span>
              </Link>
              <a 
                href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" 
                target="_blank"
                className="px-5 py-2.5 bg-[#201f22] hover:bg-[#2a2a2c] border border-[#444748] text-white font-mono text-xs rounded transition-all flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full"></span>
                <span>View Base Sepolia Contract</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. METRIC STRIP (4 Columns) */}
        <section className="w-full px-6 sm:px-8 py-8 bg-[#1c1b1d] border-y border-[#444748]/40">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#201f22] p-4 rounded flex flex-col justify-between gap-3 border border-[#444748]/40">
              <span className="font-mono text-[10px] text-[#c4c7c8] uppercase tracking-wider">Settlement Cost</span>
              <div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">&lt; $0.002</div>
                <p className="text-xs text-[#c4c7c8] mt-0.5">Base L2 EIP-4844 blobs</p>
              </div>
              <div className="h-1 w-full bg-[#0e0e10] rounded overflow-hidden">
                <div className="h-full bg-white w-[14%]"></div>
              </div>
            </div>

            <div className="bg-[#201f22] p-4 rounded flex flex-col justify-between gap-3 border border-[#444748]/40">
              <span className="font-mono text-[10px] text-[#c4c7c8] uppercase tracking-wider">Session Security</span>
              <div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">Guarded</div>
                <p className="text-xs text-[#c4c7c8] mt-0.5">Programmatic ERC-4337 keys</p>
              </div>
              <div className="text-[11px] font-mono text-[#4edea3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full"></span>
                <span>Zero Seed Phrase Exposure</span>
              </div>
            </div>

            <div className="bg-[#201f22] p-4 rounded flex flex-col justify-between gap-3 border border-[#444748]/40">
              <span className="font-mono text-[10px] text-[#c4c7c8] uppercase tracking-wider">Protocol Spec</span>
              <div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">HTTP 402 v2</div>
                <p className="text-xs text-[#c4c7c8] mt-0.5">Linux Foundation / Base Standard</p>
              </div>
              <div className="text-[11px] font-mono text-[#c4c7c8]">
                <span>Deterministic Token Auth</span>
              </div>
            </div>

            <div className="bg-[#201f22] p-4 rounded flex flex-col justify-between gap-3 border border-[#444748]/40">
              <span className="font-mono text-[10px] text-[#c4c7c8] uppercase tracking-wider">Throughput Latency</span>
              <div>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">200ms</div>
                <p className="text-xs text-[#c4c7c8] mt-0.5">Flashblocks sub-second finality</p>
              </div>
              <div className="text-[11px] font-mono text-[#4edea3] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full"></span>
                <span>Sync Pre-confirmations</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. CODE PLAYGROUND */}
        <section className="w-full px-6 sm:px-8 py-16 bg-[#131315]">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#8e9192] uppercase tracking-wider">Integration Playground</span>
                <h2 className="text-2xl font-bold text-white mt-1">Execute Micro-Settlement in 12 Lines</h2>
              </div>
              <div className="font-mono text-xs text-[#c4c7c8] flex items-center gap-2">
                <span>Runtime: Node 20+ / Bun / Deno</span>
                <span className="text-[#444748]">·</span>
                <span className="text-white">Base L2 (Sepolia)</span>
              </div>
            </div>

            <div className="w-full bg-[#0e0e10] rounded border border-[#444748]/60 overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center justify-between bg-[#201f22] px-4 py-2 border-b border-[#444748]/60">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <button 
                    onClick={() => setTab('sdk')}
                    className={`px-3 py-1 rounded transition-colors ${tab === 'sdk' ? 'bg-[#353437] text-white font-medium' : 'text-[#c4c7c8] hover:text-white'}`}
                  >
                    [Agent Client SDK]
                  </button>
                  <button 
                    onClick={() => setTab('middleware')}
                    className={`px-3 py-1 rounded transition-colors ${tab === 'middleware' ? 'bg-[#353437] text-white font-medium' : 'text-[#c4c7c8] hover:text-white'}`}
                  >
                    [x402 Server Middleware]
                  </button>
                </div>
                <span className="font-mono text-[11px] text-[#c4c7c8] bg-[#2a2a2c] px-2 py-0.5 rounded">TypeScript 5.8</span>
              </div>

              <div className="p-6 font-mono text-xs leading-relaxed overflow-x-auto text-zinc-300">
                <pre><code>{tab === 'sdk' ? (
`import { AgentPay } from "@agentpay/sdk";

const agent = new AgentPay({
  privateKey: process.env.AGENT_SESSION_KEY,
  vaultAddress: "0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347", // Live Base Sepolia
  rpcUrl: "https://sepolia.base.org"
});

// Autonomous HTTP 402 negotiation
const { data, costPaid, txHash } = await agent.fetchWithPayment(
  "https://api.compute-swarm.xyz/v1/inference"
);

console.log("Unlocked data:", data, "Settled on Base:", txHash);`
                ) : (
`import { createX402Paywall } from "@agentpay/sdk/middleware";
import http from "http";

const paywall = createX402Paywall({
  costUsdc: "0.05",
  recipient: "0xB7800423D65aB8aa92E5BD3791aa1733ca44673a", // Master Treasury
  tokenAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
  networkId: "eip155:84532"
});

const server = http.createServer((req, res) => {
  paywall(req, res, () => {
    res.end(JSON.stringify({ status: "SUCCESS", data: "Unlocked payload." }));
  });
});`
                )}</code></pre>
              </div>

              <div className="bg-[#2a2a2c] px-4 py-2 border-t border-[#444748]/60 flex items-center justify-between font-mono text-[11px] text-[#c4c7c8]">
                <div className="flex items-center gap-3">
                  <span className="text-[#4edea3]">✓ EIP-712 Signed</span>
                  <span className="text-[#444748]">|</span>
                  <span>Paymaster Sponsored Gas</span>
                </div>
                <div>Contract: 0xf57c...8347</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 3-PANEL DETERMINISTIC ARCHITECTURE */}
        <section className="w-full px-6 sm:px-8 py-16 bg-[#1c1b1d] border-t border-[#444748]/40">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            <div>
              <span className="font-mono text-xs text-[#8e9192] uppercase tracking-wider">Deterministic Architecture</span>
              <h2 className="text-2xl font-bold text-white mt-1">Purpose-Built for Machine Autonomy</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#201f22] p-6 rounded border border-[#444748]/40 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white text-base">Autonomous Session Policies</h3>
                  <p className="text-xs text-[#c4c7c8] leading-relaxed">
                    Generate scoped ephemeral keypairs with mathematical daily caps. Bound agents by hourly drawdowns and expiration timestamps with zero seed-phrase exposure.
                  </p>
                </div>
                <div className="bg-[#0e0e10] p-2.5 rounded font-mono text-[11px] text-[#4edea3]">
                  <code>AgentVault.sessions(agentKey)</code>
                </div>
              </div>

              <div className="bg-[#201f22] p-6 rounded border border-[#444748]/40 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white text-base">HTTP 402 Native Handshake</h3>
                  <p className="text-xs text-[#c4c7c8] leading-relaxed">
                    When an API returns 402 Payment Required, the client agent intercepts the header challenge, crafts an on-chain settlement, and retries in milliseconds.
                  </p>
                </div>
                <div className="bg-[#0e0e10] p-2.5 rounded font-mono text-[11px] text-white">
                  <code>PAYMENT-REQUIRED ➔ SIGNATURE</code>
                </div>
              </div>

              <div className="bg-[#201f22] p-6 rounded border border-[#444748]/40 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-white text-base">Flashblocks Clearance</h3>
                  <p className="text-xs text-[#c4c7c8] leading-relaxed">
                    Native synchronization to Base L2 Flashblocks gives immediate 200ms pre-confirmations, preventing unbacked compute leaks.
                  </p>
                </div>
                <div className="bg-[#0e0e10] p-2.5 rounded font-mono text-[11px] text-[#4edea3]">
                  <code>194ms average finality</code>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#0e0e10] border-t border-[#444748]/60 py-8 px-6 sm:px-8 font-mono text-xs text-[#c4c7c8]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span className="text-white font-medium">AgentPay Foundation</span>
            <span>· MIT / Apache 2.0 Dual License</span>
          </div>
          <div>Base Sepolia Contract: 0xf57c...8347</div>
        </div>
      </footer>

    </div>
  );
}
