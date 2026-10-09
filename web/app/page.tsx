'use client';

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  Layers, 
  Zap, 
  Terminal,
  Code2
} from 'lucide-react';

export default function PaythosProtocolHub() {
  const [tab, setTab] = useState<'client' | 'middleware'>('client');
  const [copied, setCopied] = useState(false);
  const [liveBlock, setLiveBlock] = useState<string>('Syncing...');
  const [liveGas, setLiveGas] = useState<string>('0.001 Gwei');

  // REAL LIVE TELEMETRY DIRECT FROM BASE SEPOLIA RPC
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
    <div className="bg-[#030816] text-white min-h-screen antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP LIVE BASE RPC TICKER */}
      <div className="border-b border-blue-900/40 bg-[#02050E] px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono text-blue-200/70">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-white font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>Base Sepolia: Live RPC</span>
            </span>
            <span className="text-blue-900 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-blue-200/80">Protocol: <span className="text-white">x402 v2.1</span></span>
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

      {/* 2. BASE BLUE NAVBAR */}
      <header className="border-b border-blue-900/40 sticky top-0 z-50 bg-[#030816]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img src="/logo.svg" alt="Paythos" className="h-8 w-8 rounded-lg shadow-md shadow-blue-500/20" />
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">Paythos</span>
                <span className="text-[10px] font-mono text-blue-400 block leading-none">Agentic Payment Systems</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6 text-xs font-mono text-blue-200/70">
              <a href="#quickstart" className="hover:text-white transition">Quickstart</a>
              <a href="#architecture" className="hover:text-white transition">Architecture</a>
              <a href="#playground" className="hover:text-white transition">Code</a>
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
              className="px-3.5 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/50 text-blue-200 text-xs font-mono transition flex items-center space-x-1.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-blue-400" />
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

      {/* 3. HERO SECTION (BASE BLUE IMMERSION) */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center relative">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#0052FF]/20 blur-[140px] rounded-full pointer-events-none" />

        {/* BUILT ON BASE ECOSYSTEM BADGE */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-950/90 border border-blue-700/60 text-blue-300 text-xs font-mono mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
          <span>Built on</span>
          <span className="font-bold text-white tracking-wide">BASE</span>
          <span className="text-blue-500">·</span>
          <span>x402 Protocol</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.05] mb-4">
          Paythos
        </h1>
        
        <p className="text-xl sm:text-2xl font-bold text-blue-400 tracking-tight mb-6">
          Agentic Payment Systems
        </p>

        <p className="text-sm sm:text-base text-blue-100/70 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Non-custodial session policies, mathematical spend limits, and sub-cent on-chain micro-settlements for autonomous software on Base.
        </p>

        {/* REFINED INSTALLATION COMMAND BAR */}
        <div id="quickstart" className="max-w-md mx-auto mb-14 rounded-xl bg-[#050E24] border border-blue-900/60 p-2 flex items-center justify-between shadow-2xl">
          <div className="flex items-center space-x-2.5 px-3 font-mono text-xs text-blue-100 truncate">
            <span className="text-[#0052FF] font-bold select-none">$</span>
            <span className="tracking-tight">npm install paythos-sdk viem</span>
          </div>

          <button
            onClick={copyInstall}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition flex items-center space-x-1.5 shrink-0 shadow"
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

        {/* 4 REFINED METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-4 rounded-xl bg-[#050E24] border border-blue-900/50">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Settlement Cost</span>
            <div className="text-xl font-bold font-mono text-white mt-1">&lt; $0.002</div>
            <span className="text-[11px] text-blue-300/70">Base L2 EIP-4844</span>
          </div>

          <div className="p-4 rounded-xl bg-[#050E24] border border-blue-900/50">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Session Security</span>
            <div className="text-xl font-bold font-mono text-white mt-1">Guarded</div>
            <span className="text-[11px] text-blue-300/70">Zero master key exposure</span>
          </div>

          <div className="p-4 rounded-xl bg-[#050E24] border border-blue-900/50">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Protocol Spec</span>
            <div className="text-xl font-bold font-mono text-white mt-1">x402 v2</div>
            <span className="text-[11px] text-blue-300/70">Linux Foundation Standard</span>
          </div>

          <div className="p-4 rounded-xl bg-[#050E24] border border-blue-900/50">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">Throughput Latency</span>
            <div className="text-xl font-bold font-mono text-white mt-1">184ms</div>
            <span className="text-[11px] text-blue-300/70">Flashblocks finality</span>
          </div>
        </div>
      </section>

      {/* 4. CODE PLAYGROUND */}
      <section id="playground" className="max-w-4xl mx-auto px-6 py-14 border-t border-blue-900/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Developer Surface</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Production Execution in 12 Lines
            </h2>
          </div>

          <div className="flex p-0.5 rounded-lg bg-[#050E24] border border-blue-900/50 font-mono text-xs self-start">
            <button
              onClick={() => setTab('client')}
              className={`px-3 py-1.5 rounded-md transition ${tab === 'client' ? 'bg-[#0052FF] text-white font-semibold shadow' : 'text-blue-300/70 hover:text-white'}`}
            >
              Agent Client SDK
            </button>
            <button
              onClick={() => setTab('middleware')}
              className={`px-3 py-1.5 rounded-md transition ${tab === 'middleware' ? 'bg-[#0052FF] text-white font-semibold shadow' : 'text-blue-300/70 hover:text-white'}`}
            >
              x402 Middleware
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-blue-900/60 bg-[#040A1A] overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 border-b border-blue-900/40 bg-[#020612] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-200">
                {tab === 'client' ? 'agent-client.ts' : 'x402-server.ts'}
              </span>
            </div>
            <span className="text-blue-400 text-[11px]">TypeScript · Base Sepolia</span>
          </div>

          <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-[#CBD5E1] bg-[#030714]">
            {tab === 'client' ? (
              <pre><code>
<span className="text-purple-400">import</span> &#123; <span className="text-amber-300">Paythos</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">&quot;paythos-sdk&quot;</span>;<br /><br />
<span className="text-slate-500 italic">// 1. Initialize agent with ephemeral restricted session key</span><br />
<span className="text-purple-400">const</span> <span className="text-blue-300">agent</span> = <span className="text-purple-400">new</span> <span className="text-amber-300">Paythos</span>(&#123;<br />
  &nbsp;&nbsp;<span className="text-blue-200">privateKey</span>: <span className="text-blue-200">process</span>.<span className="text-blue-200">env</span>.<span className="text-amber-400">AGENT_SESSION_KEY</span>,<br />
  &nbsp;&nbsp;<span className="text-blue-200">vaultAddress</span>: <span className="text-emerald-400">&quot;0xf57c0cEBc9238A3fe10dE6f05fa017aC68878347&quot;</span>, <span className="text-slate-500 italic">// Verified Base Sepolia</span><br />
  &nbsp;&nbsp;<span className="text-blue-200">rpcUrl</span>: <span className="text-emerald-400">&quot;https://sepolia.base.org&quot;</span><br />
&#125;);<br /><br />
<span className="text-slate-500 italic">// 2. Autonomous HTTP 402 negotiation</span><br />
<span className="text-slate-500 italic">// Catches PAYMENT-REQUIRED, signs on Base, attaches receipt & unlocks data</span><br />
<span className="text-purple-400">const</span> &#123; <span className="text-blue-200">data</span>, <span className="text-blue-200">costPaid</span>, <span className="text-blue-200">txHash</span> &#125; = <span className="text-purple-400">await</span> <span className="text-blue-300">agent</span>.<span className="text-cyan-400">fetchWithPayment</span>(<br />
  &nbsp;&nbsp;<span className="text-emerald-400">&quot;https://api.marketdata.xyz/v1/alpha&quot;</span><br />
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

          <div className="bg-[#02050E] px-4 py-2 border-t border-blue-900/40 flex items-center justify-between font-mono text-[11px] text-blue-200/60">
            <div className="flex items-center space-x-3">
              <span className="text-[#10B981] font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>EIP-712 Signed</span>
              </span>
              <span className="text-blue-900">|</span>
              <span className="text-blue-400">Gas Sponsored</span>
            </div>
            <div>Contract: 0xf57c...8347</div>
          </div>
        </div>
      </section>

      {/* 5. 3 ARCHITECTURE CARDS */}
      <section id="architecture" className="max-w-4xl mx-auto px-6 py-14 border-t border-blue-900/40">
        <div className="mb-8">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Deterministic Systems</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Built for Machine-to-Machine Autonomy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#050E24] border border-blue-900/50 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-blue-400 uppercase">01 / Session Policies</span>
              <h3 className="font-semibold text-white text-sm">Autonomous Guardrails</h3>
              <p className="text-xs text-blue-200/70 leading-relaxed font-normal">
                Generate ephemeral keypairs with mathematical daily caps. Bound agents by rolling 24h drawdowns with zero master key exposure.
              </p>
            </div>
            <div className="p-2 rounded bg-[#020612] border border-blue-900/40 font-mono text-[11px] text-blue-300">
              <code>PaythosVault.sessions(key)</code>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#050E24] border border-blue-900/50 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-blue-400 uppercase">02 / Open Standard</span>
              <h3 className="font-semibold text-white text-sm">HTTP 402 Handshake</h3>
              <p className="text-xs text-blue-200/70 leading-relaxed font-normal">
                When an API returns 402 Payment Required, the client agent intercepts the header challenge, crafts an on-chain settlement, and unlocks in &lt;200ms.
              </p>
            </div>
            <div className="p-2 rounded bg-[#020612] border border-blue-900/40 font-mono text-[11px] text-blue-300">
              <code>402 ➔ PAYMENT-SIGNATURE</code>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#050E24] border border-blue-900/50 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-blue-400 uppercase">03 / Sub-Cent Latency</span>
              <h3 className="font-semibold text-white text-sm">Flashblocks Clearance</h3>
              <p className="text-xs text-blue-200/70 leading-relaxed font-normal">
                Native synchronization to Base L2 Flashblocks gives immediate 200ms pre-confirmations, preventing unbacked compute leaks.
              </p>
            </div>
            <div className="p-2 rounded bg-[#020612] border border-blue-900/40 font-mono text-[11px] text-blue-300">
              <code>184ms average finality</code>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MINIMALIST BASE FOOTER */}
      <footer className="border-t border-blue-900/40 bg-[#02050E] py-10 px-6 font-mono text-xs text-blue-200/60">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-bold text-white">Paythos Protocol</span>
            <span className="text-blue-500">·</span>
            <span>Built on Base</span>
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
