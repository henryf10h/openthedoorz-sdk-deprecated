import { useState, useEffect } from 'react';

export interface TokenPrices {
    ETH: number;
    STRK: number;
    USDC: number;
}

/**
 * Hook to fetch real-time token prices from CoinGecko
 */
export function useTokenPrices() {
    const [prices, setPrices] = useState<TokenPrices>({
        ETH: 3400, // Fallback prices
        STRK: 0.50,
        USDC: 1.00
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                setIsLoading(true);
                // CoinGecko IDs: ethereum, starknet, usd-coin
                // Try a few times in case of transient network/CORS issues from the browser
                // Use internal API route to avoid browser CORS/network failures
                const url = '/api/prices';
                let attempt = 0;
                let response: Response | null = null;
                let lastError: any = null;
                while (attempt < 3) {
                    try {
                        response = await fetch(url);
                        if (response.ok) break;
                        const text = await response.text().catch(() => '');
                        lastError = new Error(`Failed to fetch prices: ${response.status} ${response.statusText} ${text}`);
                    } catch (e) {
                        lastError = e;
                    }
                    attempt++;
                    // exponential backoff
                    await new Promise((res) => setTimeout(res, 500 * attempt));
                }

                if (!response || !response.ok) {
                    throw lastError || new Error('Failed to fetch prices: unknown error');
                }

                const data = await response.json();

                setPrices({
                    ETH: data.ethereum?.usd || 3400,
                    STRK: data.starknet?.usd || 0.50,
                    USDC: data['usd-coin']?.usd || 1.00
                });
                setError(null);
            } catch (err: any) {
                console.error('Price fetch error:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrices();
        // Refresh prices every 60 seconds
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    return { prices, isLoading, error };
}
