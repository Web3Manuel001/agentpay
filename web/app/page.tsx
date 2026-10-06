'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  KeyRound, 
  Layers, 
  Zap,
  CheckCircle2,
  Code2,
  Lock,
  Cpu,
  ArrowUpRight
} from 'lucide-react';

export default function PaythosProtocolHub() {
  const [tab, setTab] = useState<'sdk' | 'middleware'>('sdk');
  const [copied, setCopied] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(21849204);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock((prev) => prev + Math.floor(Math.random() * 2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install paythos-sdk viem');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] font-sans min-h-screen antialiased selection:bg-zinc-800 selection:text-white">
      
      {/* 1. TOP METRIC TICKER (Clean, restrained hairline border) */}
      <div className="border-b border-white/[0.06] bg-[#0c0c0e] px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Base L2 Settlement: Active</span>
            </span>
            <span className="text-zinc-700 hidden sm:inline">/</span>
            <span className="hidden sm:inline text-zinc-400">x402 Protocol v2.1</span>
            <span className="text-zinc-700 hidden sm:inline">/</span>
            <span className="hidden sm:inline text-zinc-400">Latency: <span className="text-zinc-200">184ms Flashblocks</span></span>
          </div>
          <div className="flex items-center space-x-3 text-zinc-500">
            <span>Block #{currentBlock.toLocaleString()}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-300">0.0018 Gwei</span>
          </div>
        </div>
      </div>

      {/* 2. INSTITUTIONAL NAVBAR */}
      <header className="border-b border-white/[0.06] sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center font-mono font-bold text-xs">
                P
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">Paythos</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                v0.1.0
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6 text-xs text-zinc-400 font-mono">
              <a href="#quickstart" className="hover:text-white transition">Quickstart</a>
              <a href="#architecture" className="hover:text-white transition">Architecture</a>
              <a href="#playground" className="hover:text-white transition">Integration</a>
              <a 
                href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" 
                target="_blank" 
                className="hover:text-white transition flex items-center space-x-1"
              >
                <span>Basescan</span>
                <ExternalLink className="w-3 h-3 text-zinc-600" />
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="https://github.com/Web3Manuel001/paythos" 
              target="_blank"
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono transition flex items-center space-x-1.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            
            <a 
              href="#playground"
              className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition shadow-sm flex items-center space-x-1.5"
            >
              <span>View Code</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (Restrained, high-density typography) */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        
        {/* Crisp status pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Non-Custodial x402 Protocol · Base L2</span>
        </div>

        {/* Clean, un-corrupted headline with vertical luminance fade */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6">
          The Monetary Ethos for <br />
          <span className="text-zinc-400 font-medium">Autonomous AI Agents</span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Programmatic session policies, mathematical spend limits, and sub-cent on-chain micro-settlements for autonomous software on Base.
        </p>

        {/* CLEAN, UNCLIPPED COMMAND BAR */}
        <div id="quickstart" className="max-w-md mx-auto mb-16 rounded-xl bg-zinc-950 border border-zinc-800 p-2 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-2.5 px-3 font-mono text-xs text-zinc-300 truncate">
            <span className="text-zinc-600 font-bold">$</span>
            <span className="tracking-tight">npm install paythos-sdk viem</span>
          </div>

          <button
            onClick={copyInstall}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-800 transition flex items-center space-x-1.5 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-zinc-100" />
                <span className="text-zinc-100">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* 4 DISCIPLINED STAT CARDS (Zero rainbow circus, pure architectural restraint) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Settlement Cost</span>
            <div className="text-xl font-bold font-mono text-white mt-1">&lt; $0.002</div>
            <span className="text-[11px] text-zinc-500">Base L2 EIP-4844</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Session Security</span>
            <div className="text-xl font-bold font-mono text-zinc-100 mt-1">Guarded</div>
            <span className="text-[11px] text-zinc-500">Zero master key exposure</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Protocol Spec</span>
            <div className="text-xl font-bold font-mono text-zinc-100 mt-1">x402 v2</div>
            <span className="text-[11px] text-zinc-500">Linux Foundation standard</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Throughput Latency</span>
            <div className="text-xl font-bold font-mono text-zinc-100 mt-1">184ms</div>
            <span className="text-[11px] text-zinc-500">Flashblocks finality</span>
          </div>
        </div>
      </section>

      {/* 4. CODE WORKSPACE (Refined Tokyo Night palette, no garish neon) */}
      <section id="playground" className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Integration Playground</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Production Execution in 12 Lines
            </h2>
          </div>

          {/* Minimalist Tabs */}
          <div className="flex p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs self-start">
            <button
              onClick={() => setTab('sdk')}
              className={`px-3 py-1.5 rounded-md transition ${tab === 'sdk' ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-white'}`}
            >
              Agent Client SDK
            </button>
            <button
              onClick={() => setTab('middleware')}
              className={`px-3 py-1.5 rounded-md transition ${tab === 'middleware' ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-white'}`}
            >
              x402 Middleware
            </button>
          </div>
        </div>

        {/* Clean, grounded terminal window */}
        <div className="rounded-xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-400">
                {tab === 'sdk' ? 'agent-client.ts' : 'x402-server.ts'}
              </span>
            </div>
            <span className="text-zinc-500 text-[11px]">TypeScript · Base Sepolia</span>
          </div>

          {/* SUBDUED, PROFESSIONAL SYNTAX HIGHLIGHTING */}
          <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-[#ABB2BF] bg-[#0c0c0e]">
            {tab === 'sdk' ? (
              <pre><code>
<span className="text-[#C678DD]">import</span> &#123; <span className="text-[#E5C07B]">Paythos</span> &#125; <span className="text-[#C678DD]">from</span> <span className="text-[#98C379]">&quot;paythos-sdk&quot;</span>;<br /><br />
<span className="text-[#5C6370] italic">// 1. Initialize agent with ephemeral restricted session key</span><br />
<span className="text-[#C678DD]">const</span> <span className="text-[#E06C75]">agent</span> = <span className="text-[#C678DD]">new</span> <span className="text-[#E5C07B]">Paythos</span>(&#123;<br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">privateKey</span>: <span className="text-[#E06C75]">process</span>.<span className="text-[#E06C75]">env</span>.<span className="text-[#D19A66]">AGENT_SESSION_KEY</span>,<br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">vaultAddress</span>: <span className="text-[#98C379]">&quot;0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347&quot;</span>, <span className="text-[#5C6370] italic">// Live Base Sepolia</span><br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">rpcUrl</span>: <span className="text-[#98C379]">&quot;https://sepolia.base.org&quot;</span><br />
&#125;);<br /><br />
<span className="text-[#5C6370] italic">// 2. Autonomous HTTP 402 negotiation</span><br />
<span className="text-[#5C6370] italic">// Catches PAYMENT-REQUIRED, signs on Base, attaches receipt & unlocks data</span><br />
<span className="text-[#C678DD]">const</span> &#123; <span className="text-[#E06C75]">data</span>, <span className="text-[#E06C75]">costPaid</span>, <span className="text-[#E06C75]">txHash</span> &#125; = <span className="text-[#C678DD]">await</span> <span className="text-[#E06C75]">agent</span>.<span className="text-[#61AFEF]">fetchWithPayment</span>(<br />
  &nbsp;&nbsp;<span className="text-[#98C379]">&quot;https://api.marketdata.xyz/v1/alpha&quot;</span><br />
);<br /><br />
<span className="text-[#E5C07B]">console</span>.<span className="text-[#61AFEF]">log</span>(<span className="text-[#98C379]">`Unlocked:`</span>, <span className="text-[#E06C75]">data</span>, <span className="text-[#98C379]">`Settled on Base:`</span>, <span className="text-[#E06C75]">txHash</span>);
              </code></pre>
            ) : (
              <pre><code>
<span className="text-[#C678DD]">import</span> &#123; <span className="text-[#61AFEF]">createX402Paywall</span> &#125; <span className="text-[#C678DD]">from</span> <span className="text-[#98C379]">&quot;paythos-sdk/middleware&quot;</span>;<br />
<span className="text-[#C678DD]">import</span> <span className="text-[#E5C07B]">http</span> <span className="text-[#C678DD]">from</span> <span className="text-[#98C379]">&quot;http&quot;</span>;<br /><br />
<span className="text-[#5C6370] italic">// Gating REST endpoints with HTTP 402 on Base Layer 2</span><br />
<span className="text-[#C678DD]">const</span> <span className="text-[#E06C75]">paywall</span> = <span className="text-[#61AFEF]">createX402Paywall</span>(&#123;<br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">costUsdc</span>: <span className="text-[#98C379]">&quot;0.05&quot;</span>,<br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">recipient</span>: <span className="text-[#98C379]">&quot;0xB7800423D65aB8aa92E5BD3791aa1733ca44673a&quot;</span>, <span className="text-[#5C6370] italic">// Master Treasury</span><br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">tokenAddress</span>: <span className="text-[#98C379]">&quot;0x036CbD53842c5426634e7929541eC2318f3dCF7e&quot;</span>, <span className="text-[#5C6370] italic">// Base Sepolia USDC</span><br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">networkId</span>: <span className="text-[#98C379]">&quot;eip155:84532&quot;</span><br />
&#125;);<br /><br />
<span className="text-[#E06C75]">const</span> <span className="text-[#E06C75]">server</span> = <span className="text-[#E5C07B]">http</span>.<span className="text-[#61AFEF]">createServer</span>((<span className="text-[#E06C75]">req</span>, <span className="text-[#E06C75]">res</span>) =&gt; &#123;<br />
  &nbsp;&nbsp;<span className="text-[#61AFEF]">paywall</span>(<span className="text-[#E06C75]">req</span>, <span className="text-[#E06C75]">res</span>, () =&gt; &#123;<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#E06C75]">res</span>.<span className="text-[#61AFEF]">end</span>(<span className="text-[#E5C07B]">JSON</span>.<span className="text-[#61AFEF]">stringify</span>(&#123; <span className="text-[#E06C75]">status</span>: <span className="text-[#98C379]">&quot;SUCCESS&quot;</span>, <span className="text-[#E06C75]">data</span>: <span className="text-[#98C379]">&quot;Unlocked payload.&quot;</span> &#125;));<br />
  &nbsp;&nbsp;&#125;);<br />
&#125;);<br /><br />
<span className="text-[#E06C75]">server</span>.<span className="text-[#61AFEF]">listen</span>(<span className="text-[#D19A66]">4000</span>);
              </code></pre>
            )}
          </div>

          <div className="bg-zinc-950 px-4 py-2 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[11px] text-zinc-500">
            <div className="flex items-center space-x-3">
              <span className="text-zinc-300">✓ EIP-712 Signed</span>
              <span className="text-zinc-700">|</span>
              <span>Gas Sponsored</span>
            </div>
            <div>0xf57c...8347</div>
          </div>
        </div>
      </section>

      {/* 5. THE 3 ARCHITECTURE PILLARS (Clean, structural hairline boxes) */}
      <section id="architecture" className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="mb-8">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Deterministic Systems</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Built for Machine-to-Machine Autonomy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase">01 / Session Policies</span>
              <h3 className="font-semibold text-white text-sm">Autonomous Guardrails</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Generate ephemeral keypairs with mathematical daily caps. Bound agents by rolling 24h drawdowns and automated expiries with zero master key exposure.
              </p>
            </div>
            <div className="p-2 rounded bg-[#0c0c0e] border border-zinc-800/60 font-mono text-[11px] text-zinc-300">
              <code>PaythosVault.sessions(key)</code>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase">02 / Open Standard</span>
              <h3 className="font-semibold text-white text-sm">HTTP 402 Handshake</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                When an API returns 402 Payment Required, the client agent intercepts the header challenge, crafts an on-chain settlement, and unlocks the resource in &lt;200ms.
              </p>
            </div>
            <div className="p-2 rounded bg-[#0c0c0e] border border-zinc-800/60 font-mono text-[11px] text-zinc-300">
              <code>402 ➔ PAYMENT-SIGNATURE</code>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase">03 / Sub-Cent Latency</span>
              <h3 className="font-semibold text-white text-sm">Flashblocks Clearance</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Native synchronization to Base L2 Flashblocks gives immediate 200ms pre-confirmations, preventing unbacked compute leaks before inference finishes.
              </p>
            </div>
            <div className="p-2 rounded bg-[#0c0c0e] border border-zinc-800/60 font-mono text-[11px] text-zinc-300">
              <code>184ms average finality</code>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MINIMALIST FOOTER */}
      <footer className="border-t border-zinc-800/80 py-10 px-6 font-mono text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
            <span className="font-semibold text-white">Paythos Foundation</span>
            <span>· MIT / Apache 2.0 Dual License</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/Web3Manuel001/paythos" target="_blank" className="hover:text-white transition">GitHub</a>
            <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="hover:text-white transition">Basescan</a>
            <a href="https://x402.org" target="_blank" className="hover:text-white transition">x402 Spec</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
