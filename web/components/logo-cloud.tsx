import React from 'react';

export default function LogoCloud() {
  const partners = [
    { name: 'Base L2', label: 'Settlement Hub' },
    { name: 'LangChain', label: 'Native Tools' },
    { name: 'ElizaOS', label: 'ai16z Plugin' },
    { name: 'Anthropic Claude', label: 'Universal MCP' },
    { name: 'Cursor', label: 'Editor Skillpack' },
    { name: 'x402 Protocol', label: 'IETF Standard' },
    { name: 'Groq LPU', label: 'Qwen 3.8 Engine' },
    { name: 'Viem', label: 'EVM Driver' },
  ];

  return (
    <section className="w-full border-y border-white/[0.08] bg-[#02050E] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-mono text-center text-blue-300/60 uppercase tracking-widest mb-6">
          Architected for Universal Interoperability Across Frontier Frameworks
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center justify-center">
          {partners.map((p) => (
            <div
              key={p.name}
              className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] hover:border-blue-500/30 hover:bg-blue-500/[0.03] transition flex flex-col items-center justify-center text-center group"
            >
              <span className="text-xs font-mono font-semibold text-zinc-300 group-hover:text-white transition">
                {p.name}
              </span>
              <span className="text-[9px] font-mono text-blue-400/70 mt-0.5">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
