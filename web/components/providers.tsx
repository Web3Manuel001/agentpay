'use client';

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
  const rawAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const isConfigured = rawAppId && !rawAppId.includes('xxx') && !rawAppId.includes('insert-');

  // If Privy is not yet configured, render children cleanly without crashing SSG
  if (!isConfigured) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={rawAppId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#f4f4f5',
          showWalletLoginFirst: false,
        },
        loginMethods: ['google', 'twitter', 'email', 'wallet'],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        defaultChain: baseSepolia,
        supportedChains: [base, baseSepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
