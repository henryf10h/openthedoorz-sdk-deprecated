'use client';

import React from 'react';
import { ChipiClientProvider } from '@chipi-stack/nextjs';
import { NetworkProvider } from '@/lib/hooks/useNetwork.tsx';

// CRITICAL: Use hardcoded config for Cloudflare Pages compatibility
import { chipiConfig } from '@/lib/config/env';

const CHIPI_API_KEY = chipiConfig.apiPublicKey;
const CHIPI_ALPHA_URL = chipiConfig.alphaUrl;

export default function ChipiProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChipiClientProvider apiPublicKey={CHIPI_API_KEY} alphaUrl={CHIPI_ALPHA_URL}>
      <NetworkProvider>{children}</NetworkProvider>
    </ChipiClientProvider>
  );
}
