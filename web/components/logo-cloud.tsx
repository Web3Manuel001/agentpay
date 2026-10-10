import React from 'react';

export default function LogoCloud() {
  return (
    <section className="w-full border-y border-white/[0.08] bg-[#02050E] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-mono text-center text-blue-300/60 uppercase tracking-widest mb-8">
          Architected for Universal Interoperability Across Frontier Frameworks
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center justify-center">
          
          {/* 1. BASE */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-blue-500/40 hover:bg-blue-500/[0.04] transition-all flex flex-col items-center justify-center group h-24">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-zinc-400 group-hover:fill-[#0052FF] transition-colors" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition mt-2">Base L2</span>
            <span className="text-[9px] font-mono text-blue-400/70">Settlement Hub</span>
          </div>

          {/* 2. LANGCHAIN */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all flex flex-col items-center justify-center group h-24">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-zinc-400 group-hover:stroke-emerald-400 fill-none transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition mt-2">LangChain</span>
            <span className="text-[9px] font-mono text-emerald-400/70">Native Tools</span>
          </div>

          {/* 3. ELIZAOS (ai16z) */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-purple-500/40 hover:bg-purple-500/[0.04] transition-all flex flex-col items-center justify-center group h-24">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-zinc-400 group-hover:stroke-purple-400 fill-none transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="12" x="3" y="4" rx="2" />
              <line x1="2" x2="22" y1="20" y2="20" />
              <circle cx="8" cy="10" r="1" fill="currentColor" />
              <circle cx="16" cy="10" r="1" fill="currentColor" />
            </svg>
            <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition mt-2">ElizaOS</span>
            <span className="text-[9px] font-mono text-purple-400/70">ai16z Plugin</span>
          </div>

          {/* 4. ANTHROPIC CLAUDE */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-amber-500/40 hover:bg-amber-500/[0.04] transition-all flex flex-col items-center justify-center group h-24">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-zinc-400 group-hover:stroke-amber-400 fill-none transition-colors" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
            </svg>
            <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition mt-2">Claude</span>
            <span className="text-[9px] font-mono text-amber-400/70">Universal MCP</span>
          </div>

          {/* 5. CURSOR */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-blue-400/40 hover:bg-blue-400/[0.04] transition-all flex flex-col items-center justify-center group h-24">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-zinc-400 group-hover:stroke-blue-300 fill-none transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition mt-2">Cursor</span>
            <span className="text-[9px] font-mono text-blue-300/70">Skill Pack</span>
          </div>

          {/* 6. x402 PROTOCOL */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all flex flex-col items-center justify-center group h-24">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-zinc-400 group-hover:stroke-[#10B981] fill-none transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition mt-2">x402 v2</span>
            <span className="text-[9px] font-mono text-emerald-400/70">IETF Standard</span>
          </div>

          {/* 7. GROQ */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-orange-500/40 hover:bg-orange-500/[0.04] transition-all flex flex-col items-center justify-center group h-24">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-zinc-400 group-hover:stroke-orange-400 fill-none transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition mt-2">Groq</span>
            <span className="text-[9px] font-mono text-orange-400/70">LPU Engine</span>
          </div>

          {/* 8. VIEM */}
          <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-zinc-300/40 hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center group h-24">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-zinc-400 group-hover:stroke-white fill-none transition-colors" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12l-6 18z" />
            </svg>
            <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition mt-2">Viem</span>
            <span className="text-[9px] font-mono text-zinc-400/70">EVM Core</span>
          </div>

        </div>
      </div>
    </section>
  );
}
