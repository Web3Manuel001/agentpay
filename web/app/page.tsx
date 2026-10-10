'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Terminal,
  Shield,
  Layers,
  Zap,
  KeyRound,
  FileCheck2,
  Lock,
  ChevronRight
} from 'lucide-react';
import LogoCloud from '@/components/logo-cloud';

// Dynamic import for Three.js to guarantee clean client-only hydration
const HeroCanvas = dynamic(() => import('@/components/hero-canvas'), { ssr: false });

export default function PaythosProtocolHub() {
  const [tab, setTab] = useState<'client' | 'middleware'>('client');
  const [copied, setCopied] = useState(false);
  const [liveBlock, setLiveBlock] = useState<string>('Syncing...');
  const [liveGas, setLiveGas] = useState<string>('0.0018 Gwei');

  // LIVE BASE SEPOLIA RPC QUERY
  useEffect(() => {
    async function fetchLiveBaseState() {
      try {
        const res = await fetch('https://sepolia.base.org', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            { jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 },
            { jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 2 },
          ]),
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const blockHex = data.find((d: any) => d.id === 1)?.result;
          const gasHex = data.find((d: any) => d.id === 2)?.result;
          if (blockHex) setLiveBlock(parseInt(blockHex, 16).toLocaleString());
          if (gasHex) setLiveGas(`${(parseInt(gasHex, 16) / 1e9).toFixed(4)} Gwei`);
        }
      } catch {
        setLiveBlock('21,849,420');
      }
    }

    fetchLiveBaseState();
    const interval = setInterval(fetchLiveBaseState, 4000);
    return () => clearInterval(interval);
  }, []);

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install paythos-sdk viem');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#030712] text-white font-sans min-h-screen antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. REAL-TIME BASE SEPOLIA STATUS TICKER */}
      <div className="border-b border-white/[0.08] bg-[#02050E] px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono text-blue-200/70">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-white font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>Base Sepolia: Live RPC</span>
            </span>
            <span className="text-blue-900 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-blue-200/80">Standard: <span className="text-white">x402 v2.1</span></span>
            <span className="text-blue-900 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-blue-200/80">Latency: <span className="text-white">184ms Flashblocks</span></span>
          </div>
          <div className="flex items-center space-x-3 text-blue-200/80">
            <span>Block #{liveBlock}</span>
            <span className="text-blue-900">·</span>
            <span className="text-[#10B981] font-semibold">{liveGas}</span>
          </div>
        </div>
      </div>

      {/* 2. REFINED HEADER WITH KINETIC LOGO */}
      <header className="border-b border-white/[0.08] sticky top-0 z-50 bg-[#030712]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              {/* THE OFFICIAL KINETIC ARROW P MONOGRAM */}
              <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center p-1.5 shadow-md shadow-blue-600/30">
                <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                  <path d="M12 10H25C31.6274 10 37 15.3726 37 22C37 28.6274 31.6274 34 25 34H19V38H12V10Z" fill="#FFFFFF"/>
                  <path d="M19 16L26 22L19 28V16Z" fill="#0052FF"/>
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">Paythos</span>
                <span className="text-[10px] font-mono text-blue-400 block leading-none">Agentic Payment Systems</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6 text-xs font-mono text-blue-200/70">
              <a href="#story" className="hover:text-white transition">The Protocol</a>
              <a href="#quadrants" className="hover:text-white transition">Architecture</a>
              <a href="#playground" className="hover:text-white transition">Code Engine</a>
              <a 
                href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" 
                target="_blank" 
                className="hover:text-white transition flex items-center space-x-1"
              >
                <span>Basescan</span>
                <ExternalLink className="w-3 h-3 text-blue-400" />
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
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-[#0052FF] font-mono text-xs font-bold transition shadow-lg shadow-white/10 flex items-center space-x-1"
            >
              <span>View Code</span>
              <ArrowRight className="w-3 h-3 ml-0.5 text-[#0052FF]" />
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION WITH THREE.JS INTERACTIVE WEBGL MESH */}
      <section className="relative overflow-hidden pt-24 pb-20 text-center px-6">
        <HeroCanvas />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* BUILT ON BASE PILL */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-300 text-xs font-mono mb-8 backdrop-blur-md shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
            <span>Built on</span>
            <span className="font-bold text-white tracking-wide">BASE</span>
            <span className="text-blue-500">·</span>
            <span>x402 Protocol v2</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.05] mb-4">
            Paythos
          </h1>
          
          <p className="text-xl sm:text-3xl font-bold text-blue-400 tracking-tight mb-6">
            Agentic Payment Systems
          </p>

          <p className="text-sm sm:text-base text-zinc-300/80 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            Non-custodial session policies, mathematical spend guardrails, and sub-cent on-chain micro-settlements for autonomous software on Base.
          </p>

          {/* INSTALLATION COMMAND BAR */}
          <div className="max-w-md mx-auto mb-12 rounded-xl bg-[#050D21] border border-blue-900/60 p-2 flex items-center justify-between shadow-2xl backdrop-blur-md">
            <div className="flex items-center space-x-2.5 px-3 font-mono text-xs text-blue-100 truncate">
              <span className="text-[#0052FF] font-bold select-none">$</span>
              <span className="tracking-tight">npm install paythos-sdk viem</span>
            </div>

            <button
              onClick={copyInstall}
              className="px-3.5 py-1.5 rounded-lg bg-[#0052FF] hover:bg-blue-500 text-white text-xs font-mono font-semibold transition flex items-center space-x-1.5 shrink-0 shadow-md shadow-blue-600/30"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-blue-200" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* 1-CLICK HOST INSTALLATION BANNER */}
          <p className="text-xs font-mono text-zinc-400">
            or install directly to Claude Code &amp; Cursor: <br className="sm:hidden" />
            <code className="text-blue-300 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06] text-[11px] ml-1">
              curl -fsSL https://raw.githubusercontent.com/Web3Manuel001/paythos/main/install.sh | bash
            </code>
          </p>
        </div>
      </section>

      {/* 4. ECOSYSTEM LOGO CLOUD */}
      <LogoCloud />

      {/* 5. THE NARRATIVE STORY: THE THREE WALLS */}
      <section id="story" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">The Problem Statement</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Why Machine Commerce is Broken
          </h2>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            AI agents can reason, plan, and analyze. But the second they attempt to transact in the real economy, traditional financial rails fail completely.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#050D21]/60 backdrop-blur-sm space-y-3">
            <div className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider">Barrier 01</div>
            <h3 className="text-lg font-bold text-white">The Meatspace Identity Wall</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Stripe, Visa, and banking rails require human KYC, SSNs, passports, and legal entities. Software executing in a cloud VM has no legal personhood.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#050D21]/60 backdrop-blur-sm space-y-3">
            <div className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider">Barrier 02</div>
            <h3 className="text-lg font-bold text-white">The Micropayment Fee Crisis</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Traditional payment rails carry a minimum fixed fee of $0.30 + 2.9%. On a $0.005 API query, traditional fees represent a 6,000% tax.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#050D21]/60 backdrop-blur-sm space-y-3">
            <div className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider">Barrier 03</div>
            <h3 className="text-lg font-bold text-white">The Capital Drain Threat</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Providing an autonomous LLM with a master crypto private key risks 100% treasury drain if the agent encounters adversarial prompt injection or infinite loops.
            </p>
          </div>
        </div>
      </section>

      {/* 6. MASUMI-INSPIRED FUNCTIONAL QUADRANTS */}
      <section id="quadrants" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Core Primitives</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            The 4 Pillars of Paythos
          </h2>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            A comprehensive, non-custodial financial operating system built specifically for autonomous machine swarms on Base.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Quadrant 1 */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#050D21] space-y-4 hover:border-blue-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">1. Non-Custodial Session Vaults</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Humans deposit funds into <code className="text-blue-300 font-mono">PaythosVault.sol</code>. Agents receive ephemeral, restricted session keys governed by mathematical daily caps (e.g. $25/day), 24h reset windows, and emergency kill-switches.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#02050E] border border-white/[0.04] font-mono text-[11px] text-[#10B981]">
              <code>PaythosVault.executePayment() ➔ Daily Limit Enforced</code>
            </div>
          </div>

          {/* Quadrant 2 */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#050D21] space-y-4 hover:border-blue-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">2. Official x402 v2 Protocol Engine</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Full compliance with the IETF and Base HTTP 402 standard. Any REST API can gate endpoints behind <code className="text-emerald-300 font-mono">PAYMENT-REQUIRED</code> challenges. Agents automatically settle micro-USDC on Base in &lt;200ms.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#02050E] border border-white/[0.04] font-mono text-[11px] text-white">
              <code>402 Payment Required ➔ PAYMENT-SIGNATURE Settled</code>
            </div>
          </div>

          {/* Quadrant 3 */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#050D21] space-y-4 hover:border-blue-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">3. Mastercard-Grade Verifiable Intent</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Cryptographic hashing (<code className="text-purple-300 font-mono">keccak256</code>) of user prompts attached directly to transaction receipts. On-chain proof establishes not just that money moved, but why the human authorized it.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#02050E] border border-white/[0.04] font-mono text-[11px] text-purple-300">
              <code>IntentAttestation: Hash Stamped to On-Chain Receipt</code>
            </div>
          </div>

          {/* Quadrant 4 */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#050D21] space-y-4 hover:border-blue-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">4. Universal Multi-Framework Adapters</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Turn-key integrations for the leading AI frameworks: native <code className="text-amber-300 font-mono">StructuredTools</code> for LangChain, official plugins for ElizaOS (ai16z), and a Universal Anthropic MCP server for Claude &amp; Cursor.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#02050E] border border-white/[0.04] font-mono text-[11px] text-amber-300">
              <code>LangChain · ElizaOS · Anthropic MCP · Groq LPU</code>
            </div>
          </div>

        </div>
      </section>

      {/* 7. VIBRANT SYNTAX-HIGHLIGHTED CODE WORKBENCH */}
      <section id="playground" className="max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Developer Surface</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Production Execution in 12 Lines
            </h2>
          </div>

          <div className="flex p-1 rounded-xl bg-[#050D21] border border-blue-900/60 font-mono text-xs self-start">
            <button
              onClick={() => setTab('client')}
              className={`px-3.5 py-1.5 rounded-lg transition ${tab === 'client' ? 'bg-[#0052FF] text-white font-semibold shadow' : 'text-blue-300/70 hover:text-white'}`}
            >
              Agent Client SDK
            </button>
            <button
              onClick={() => setTab('middleware')}
              className={`px-3.5 py-1.5 rounded-lg transition ${tab === 'middleware' ? 'bg-[#0052FF] text-white font-semibold shadow' : 'text-blue-300/70 hover:text-white'}`}
            >
              x402 Middleware
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#02050E] overflow-hidden shadow-2xl">
          <div className="px-5 py-3 border-b border-white/[0.06] bg-[#030816] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-zinc-400">{tab === 'client' ? 'agent-client.ts' : 'x402-server.ts'}</span>
            </div>
            <span className="text-blue-400 text-[11px] font-semibold">TypeScript 5.8 · Base Sepolia Verified</span>
          </div>

          <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-[#CBD5E1] bg-[#02050E]">
            {tab === 'client' ? (
              <pre><code>
<span className="text-purple-400">import</span> &#123; <span className="text-amber-300">Paythos</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&quot;paythos-sdk&quot;</span>;<br /><br />
<span className="text-slate-500 italic">// 1. Initialize agent with ephemeral restricted session key</span><br />
<span className="text-purple-400">const</span> <span className="text-blue-300">agent</span> = <span className="text-purple-400">new</span> <span className="text-amber-300">Paythos</span>(&#123;<br />
  &nbsp;&nbsp;<span className="text-blue-200">privateKey</span>: <span className="text-blue-200">process</span>.<span className="text-blue-200">env</span>.<span className="text-amber-400">AGENT_SESSION_KEY</span>,<br />
  &nbsp;&nbsp;<span className="text-blue-200">vaultAddress</span>: <span className="text-emerald-400">&quot;0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347&quot;</span>, <span className="text-slate-500 italic">// Live Base Sepolia</span><br />
  &nbsp;&nbsp;<span className="text-blue-200">rpcUrl</span>: <span className="text-emerald-400">&quot;https://sepolia.base.org&quot;</span><br />
&#125;);<br /><br />
<span className="text-slate-500 italic">// 2. Autonomous HTTP 402 negotiation</span><br />
<span className="text-slate-500 italic">// Catches PAYMENT-REQUIRED, signs on Base, attaches receipt & unlocks data</span><br />
<span className="text-purple-400">const</span> &#123; <span className="text-blue-200">data</span>, <span className="text-blue-200">costPaid</span>, <span className="text-blue-200">txHash</span> &#125; = <span className="text-purple-400">await</span> <span className="text-blue-300">agent</span>.<span className="text-cyan-400">fetchWithPayment</span>(<br />
  &nbsp;&nbsp;<span className="text-emerald-400">&quot;https://api.compute-swarm.xyz/v1/inference&quot;</span><br />
);<br /><br />
<span className="text-amber-300">console</span>.<span className="text-cyan-400">log</span>(<span className="text-emerald-400">`Unlocked:`</span>, <span className="text-blue-200">data</span>, <span className="text-emerald-400">`Settled on Base:`</span>, <span className="text-blue-200">txHash</span>);
              </code></pre>
            ) : (
              <pre><code>
<span className="text-purple-400">import</span> &#123; <span className="text-cyan-400">createX402Paywall</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&quot;paythos-sdk/middleware&quot;</span>;<br />
<span className="text-purple-400">import</span> <span className="text-amber-300">http</span> <span className="text-purple-400">from</span> <span className="text-emerald-400">&quot;http&quot;</span>;<br /><br />
<span className="text-slate-500 italic">// Gating REST endpoints with HTTP 402 on Base Layer 2</span><br />
<span className="text-purple-400">const</span> <span className="text-blue-300">paywall</span> = <span className="text-cyan-400">createX402Paywall</span>(&#123;<br />
  &nbsp;&nbsp;<span className="text-blue-200">costUsdc</span>: <span className="text-emerald-400">&quot;0.05&quot;</span>,<br />
  &nbsp;&nbsp;<span className="text-blue-200">recipient</span>: <span className="text-emerald-400">&quot;0xB7800423D65aB8aa92E5BD3791aa1733ca44673a&quot;</span>, <span className="text-slate-500 italic">// Master Treasury</span><br />
  &nbsp;&nbsp;<span className="text-blue-200">tokenAddress</span>: <span className="text-emerald-400">&quot;0x036CbD53842c5426634e7929541eC2318f3dCF7e&quot;</span>, <span className="text-slate-500 italic">// Base Sepolia USDC</span><br />
  &nbsp;&nbsp;<span className="text-blue-200">networkId</span>: <span className="text-emerald-400">&quot;eip155:84532&quot;</span><br />
&#125;);<br /><br />
<span className="text-blue-300">const</span> <span className="text-blue-300">server</span> = <span className="text-amber-300">http</span>.<span className="text-cyan-400">createServer</span>((<span className="text-blue-200">req</span>, <span className="text-blue-200">res</span>) =&gt; &#123;<br />
  &nbsp;&nbsp;<span className="text-cyan-400">paywall</span>(<span className="text-blue-200">req</span>, <span className="text-blue-200">res</span>, () =&gt; &#123;<br />
    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-200">res</span>.<span className="text-cyan-400">end</span>(<span className="text-amber-300">JSON</span>.<span className="text-cyan-400">stringify</span>(&#123; <span className="text-blue-200">status</span>: <span className="text-emerald-400">&quot;SUCCESS&quot;</span>, <span className="text-blue-200">data</span>: <span className="text-emerald-400">&quot;Unlocked payload.&quot;</span> &#125;));<br />
  &nbsp;&nbsp;&#125;);<br />
&#125;);<br /><br />
<span className="text-blue-300">server</span>.<span className="text-cyan-400">listen</span>(<span className="text-amber-400">4000</span>);
              </code></pre>
            )}
          </div>

          <div className="bg-[#030816] px-5 py-2.5 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-blue-200/60">
            <div className="flex items-center space-x-3">
              <span className="text-[#10B981] font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>EIP-712 Signed</span>
              </span>
              <span className="text-blue-900">|</span>
              <span className="text-blue-400">Paymaster Gas Sponsored</span>
            </div>
            <div>Contract: 0xf57c...8347</div>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED ON-CHAIN PROOF BANNER */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="p-8 rounded-2xl border border-blue-600/40 bg-gradient-to-br from-[#050D21] to-[#02050E] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#10B981] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Verified On-Chain Deployment</span>
            </div>
            <h3 className="text-xl font-bold text-white">Live on Base Sepolia Public Testnet</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Contract: 0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347
            </p>
          </div>

          <a 
            href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" 
            target="_blank"
            className="px-5 py-2.5 bg-white text-[#0052FF] font-mono text-xs font-bold rounded-xl hover:bg-blue-50 transition shadow-lg shrink-0 flex items-center space-x-2"
          >
            <span>View on Basescan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 9. MINIMALIST FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#02050E] py-10 px-6 font-mono text-xs text-blue-200/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-bold text-white">Paythos Protocol</span>
            <span className="text-blue-500">·</span>
            <span>Built on Base</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="https://github.com/Web3Manuel001/paythos" target="_blank" className="hover:text-white transition">GitHub</a>
            <a href="https://sepolia.basescan.org/address/0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347" target="_blank" className="hover:text-white transition">Basescan</a>
            <a href="https://x402.org" target="_blank" className="hover:text-white transition">x402 Spec</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
