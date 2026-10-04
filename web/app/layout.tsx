import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers';

export const metadata: Metadata = {
  title: 'AgentPay — The Open x402 Protocol for AI Agents on Base',
  description: 'Non-custodial session policies, spend guardrails, and autonomous x402 settlement on Base.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090b] text-zinc-100 antialiased selection:bg-zinc-800">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
