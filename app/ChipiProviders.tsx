"use client";

import React, { useEffect } from 'react';
import { ChipiClientProvider } from '@chipi-stack/nextjs';
import { NetworkProvider } from '@/lib/hooks/useNetwork.tsx';

// CRITICAL: Use hardcoded config for Cloudflare Pages compatibility
import { chipiConfig } from '@/lib/config/env';

const CHIPI_API_KEY = chipiConfig.apiPublicKey;
const CHIPI_ALPHA_URL = chipiConfig.alphaUrl;

export default function ChipiProviders({ children }: { children: React.ReactNode }) {
  // Defensive cleanup after mount in case extensions mutate DOM later
  useEffect(() => {
    try {
      const re = /^(bis_|__processed_)/;
      document.querySelectorAll('*').forEach((el) => {
        Array.from(el.attributes).forEach((a) => {
          if (re.test(a.name)) el.removeAttribute(a.name);
        });
      });
    } catch (e) {
      // non-fatal
      console && console.warn && console.warn('post-mount attribute cleanup failed', e);
    }
  }, []);

  return (
    <ChipiClientProvider apiPublicKey={CHIPI_API_KEY} alphaUrl={CHIPI_ALPHA_URL}>
      <NetworkProvider>{children}</NetworkProvider>
    </ChipiClientProvider>
  );
}
