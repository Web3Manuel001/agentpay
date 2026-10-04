'use client';

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clxxxxxxxxxxxxxxxxx';

  return (
    <PrivyProvider
      appId={appId}
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
