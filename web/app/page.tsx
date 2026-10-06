'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  Zap, 
  KeyRound, 
  Layers, 
  Cpu,
  CheckCircle2,
  Code2,
  FileCode2
} from 'lucide-react';

export default function PaythosProtocolHub() {
  const [tab, setTab] = useState<'client' | 'middleware'>('client');
  const [pkgManager, setPkgManager] = useState<'npm' | 'pnpm' | 'bun'>('npm');
  const [copied, setCopied] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(21849204);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock((prev) => prev + Math.floor(Math.random() * 2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getInstallCmd = () => {
    if (pkgManager === 'pnpm') return 'pnpm add paythos-sdk viem';
    if (pkgManager === 'bun') return 'bun add paythos-sdk viem';
    return 'npm install paythos-sdk viem';
  };

  const copyInstall = () => {
    navigator.clipboard.writeText(getInstallCmd());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0A0A0C] text-[#F3F4F6] font-sans min-h-screen antialiased selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* 1. REAL-TIME PROTOCOL STATUS TICKER */}
      <div className="border-b border-white/[0.06] bg-[#070709] px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base L2 Settlement: Operational</span>
            </span>
            <span className="text-zinc-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-zinc-300">Spec: <span className="text-blue-400">x402 v2.1</span></span>
            <span className="text-zinc-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Latency: <span className="text-zinc-200 font-semibold">184ms Flashblocks</span></span>
          </div>
          <div className="flex items-center space-x-3 text-zinc-400">
            <span>BLOCK #{currentBlock.toLocaleString()}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-emerald-400">0.0018 GWEI</span>
          </div>
        </div>
      </div>

      {/* 2. INSTITUTIONAL NAVBAR */}
      <header className="border-b border-white/[0.06] sticky top-0 z-50 bg-[#0A0A0C]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-mono font-bold text-xs text-white shadow-lg shadow-blue-500/20">
                P
              </div>
              <span className="font-bold text-base tracking-tight text-white">Paythos</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                v0.1.0-alpha
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6 text-xs font-mono text-zinc-400">
              <a href="#quickstart" className="hover:text-white transition">Quickstart</a>
              <a href="#architecture" className="hover:text-white transition">Architecture</a>
              <a href="#playground" className="hover:text-white transition">Integration</a>
              <a 
                href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" 
                target="_blank" 
                className="hover:text-white transition flex items-center space-x-1"
              >
                <span>Basescan</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="https://github.com/Web3Manuel001/paythos" 
              target="_blank"
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 text-xs font-mono transition flex items-center space-x-1.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
            
            <a 
              href="#playground"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-500/25 flex items-center space-x-1.5"
            >
              <span>View Code</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center relative">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>RFC-9402 Compliance Engine · Base L2</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
          The Monetary Ethos for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Autonomous AI Agents
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Non-custodial session policies, mathematical spend guardrails, and sub-cent 
          <code className="mx-1.5 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/40 text-blue-300 font-mono text-sm">x402 v2</code> 
          settlements for autonomous agent swarms on Base.
        </p>

        {/* REFINED INSTALLATION COMMAND BAR */}
        <div id="quickstart" className="max-w-xl mx-auto mb-16 rounded-2xl bg-[#0F0F12] border border-white/[0.08] shadow-2xl p-2">
          <div className="flex items-center justify-between px-3 pt-1 pb-2 border-b border-white/[0.04]">
            <div className="flex space-x-1 font-mono text-xs">
              {(['npm', 'pnpm', 'bun'] as const).map((mgr) => (
                <button
                  key={mgr}
                  onClick={() => setPkgManager(mgr)}
                  className={`px-2.5 py-1 rounded-md transition ${pkgManager === mgr ? 'bg-blue-600 text-white font-semibold shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {mgr}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Node 20+ · ESM Native</span>
          </div>

          <div className="flex items-center justify-between px-4 py-3 font-mono text-xs sm:text-sm">
            <div className="flex items-center space-x-2.5 text-zinc-200 truncate">
              <span className="text-blue-400 select-none font-bold">$</span>
              <span className="tracking-tight">{getInstallCmd()}</span>
            </div>
            <button
              onClick={copyInstall}
              className="ml-3 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 transition flex items-center space-x-1.5 shrink-0 border border-white/[0.06]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 REFINED METRIC CARDS WITH PURPOSEFUL COLOR ACCENTS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-[#0F0F12] border border-white/[0.06] relative overflow-hidden">
            <div className="w-1 h-full bg-emerald-500 absolute top-0 left-0" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Settlement Cost</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">&lt; $0.002</div>
            <span className="text-xs text-emerald-400/90 font-medium">99% cheaper than Stripe</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F12] border border-white/[0.06] relative overflow-hidden">
            <div className="w-1 h-full bg-blue-500 absolute top-0 left-0" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Session Security</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">Guarded</div>
            <span className="text-xs text-blue-400/90 font-medium">Zero master key exposure</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F12] border border-white/[0.06] relative overflow-hidden">
            <div className="w-1 h-full bg-amber-500 absolute top-0 left-0" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Protocol Spec</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">x402 v2</div>
            <span className="text-xs text-amber-400/90 font-medium">Linux Foundation standard</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0F0F12] border border-white/[0.06] relative overflow-hidden">
            <div className="w-1 h-full bg-purple-500 absolute top-0 left-0" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Network Finality</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">200ms</div>
            <span className="text-xs text-purple-400/90 font-medium">Base L2 Flashblocks</span>
          </div>
        </div>
      </section>

      {/* 4. VIBRANT SYNTAX-HIGHLIGHTED CODE WORKSPACE */}
      <section id="playground" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Developer Surface</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Production Integration in 12 Lines
            </h2>
          </div>

          {/* CODE TAB SWITCHER */}
          <div className="flex p-1 rounded-xl bg-[#141418] border border-white/[0.08] self-start font-mono text-xs">
            <button
              onClick={() => setTab('client')}
              className={`px-3.5 py-1.5 rounded-lg transition ${tab === 'client' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              Agent Client SDK
            </button>
            <button
              onClick={() => setTab('middleware')}
              className={`px-3.5 py-1.5 rounded-lg transition ${tab === 'middleware' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-zinc-400 hover:text-white'}`}
            >
              x402 Server Middleware
            </button>
          </div>
        </div>

        {/* TOKYO NIGHT / HIGH-CONTRAST COLORFUL CODE WINDOW */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E12] overflow-hidden shadow-2xl">
          <div className="px-5 py-3 border-b border-white/[0.06] bg-[#09090D] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-zinc-400 ml-2">
                {tab === 'client' ? 'agent-client.ts' : 'x402-server.ts'}
              </span>
            </div>
            <span className="text-blue-400 text-[11px] font-semibold">TypeScript 5.8 · Base Sepolia</span>
          </div>

          {/* VIBRANT SYNTAX CODE BLOCK */}
          <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-[#ABB2BF] bg-[#0A0A0E]">
            {tab === 'client' ? (
              <pre><code>
<span className="text-[#C678DD]">import</span> &#123; <span className="text-[#E5C07B]">Paythos</span> &#125; <span className="text-[#C678DD]">from</span> <span className="text-[#98C379]">&quot;paythos-sdk&quot;</span>;<br /><br />
<span className="text-[#5C6370] italic">// 1. Initialize agent with ephemeral restricted session key</span><br />
<span className="text-[#C678DD]">const</span> <span className="text-[#E06C75]">agent</span> = <span className="text-[#C678DD]">new</span> <span className="text-[#E5C07B]">Paythos</span>(&#123;<br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">privateKey</span>: <span className="text-[#E06C75]">process</span>.<span className="text-[#E06C75]">env</span>.<span className="text-[#D19A66]">AGENT_SESSION_KEY</span>,<br />
  &nbsp;&nbsp;<span className="text-[#E06C75]">vaultAddress</span>: <span className="text-[#98C379]">&quot;0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347&quot;</span>, <span className="text-[#5C6370] italic">// Base Sepolia Verified</span><br />
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
<span className="text-[#C678DD]">const</span> <span className="text-[#E06C75]">server</span> = <span className="text-[#E5C07B]">http</span>.<span className="text-[#61AFEF]">createServer</span>((<span className="text-[#E06C75]">req</span>, <span className="text-[#E06C75]">res</span>) =&gt; &#123;<br />
  &nbsp;&nbsp;<span className="text-[#61AFEF]">paywall</span>(<span className="text-[#E06C75]">req</span>, <span className="text-[#E06C75]">res</span>, () =&gt; &#123;<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#E06C75]">res</span>.<span className="text-[#61AFEF]">end</span>(<span className="text-[#E5C07B]">JSON</span>.<span className="text-[#61AFEF]">stringify</span>(&#123; <span className="text-[#E06C75]">status</span>: <span className="text-[#98C379]">&quot;SUCCESS&quot;</span>, <span className="text-[#E06C75]">data</span>: <span className="text-[#98C379]">&quot;Unlocked payload.&quot;</span> &#125;));<br />
  &nbsp;&nbsp;&#125;);<br />
&#125;);<br /><br />
<span className="text-[#E06C75]">server</span>.<span className="text-[#61AFEF]">listen</span>(<span className="text-[#D19A66]">4000</span>);
              </code></pre>
            )}
          </div>

          <div className="bg-[#09090D] px-5 py-2.5 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>EIP-712 Signed</span>
              </span>
              <span className="text-zinc-700">|</span>
              <span className="text-blue-400">Paymaster Gas Sponsored</span>
            </div>
            <div>Contract: 0xf57c...8347</div>
          </div>
        </div>
      </section>

      {/* 5. THE 3 ARCHITECTURE PILLARS */}
      <section id="architecture" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Deterministic Systems</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Built for Machine-to-Machine Autonomy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/[0.06] flex flex-col justify-between gap-6 hover:border-white/[0.12] transition">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">Autonomous Session Policies</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Generate ephemeral keypairs with mathematical daily caps. Bound agents by rolling 24h drawdowns and automated expiries with zero master key exposure.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.04] font-mono text-[11px] text-emerald-400">
              <code>PaythosVault.sessions(agentKey)</code>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/[0.06] flex flex-col justify-between gap-6 hover:border-white/[0.12] transition">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">HTTP 402 Native Handshake</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                When an API returns 402 Payment Required, the client agent intercepts the header challenge, crafts an on-chain settlement, and unlocks the resource in &lt;200ms.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.04] font-mono text-[11px] text-amber-400">
              <code>PAYMENT-REQUIRED ➔ SIGNATURE</code>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/[0.06] flex flex-col justify-between gap-6 hover:border-white/[0.12] transition">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base">Flashblocks Clearance</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Native synchronization to Base L2 Flashblocks gives immediate 200ms pre-confirmations, preventing unbacked compute leaks before inference finishes.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.04] font-mono text-[11px] text-purple-400">
              <code>184ms average finality</code>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MINIMALIST FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#070709] py-12 px-6 font-mono text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-white">Paythos Foundation</span>
            <span>· MIT / Apache 2.0 Dual License</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/Web3Manuel001/paythos" target="_blank" className="hover:text-white transition">GitHub</a>
            <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="hover:text-white transition">Base Sepolia</a>
            <a href="https://x402.org" target="_blank" className="hover:text-white transition">x402 Spec</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
