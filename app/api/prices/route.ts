import { NextResponse } from 'next/server';

// This route must run dynamically (server runtime) because it proxies
// live requests to CoinGecko. When using `next export`/`output: export`
// Next requires routes to opt into dynamic behavior.
export const dynamic = 'force-dynamic';

export async function GET() {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,starknet,usd-coin&vs_currencies=usd';
    try {
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            console.error('CoinGecko upstream error', res.status, res.statusText, text);
            // Provide safe fallback prices so the UI remains usable instead of failing
            const fallback = {
                ethereum: { usd: 3400 },
                starknet: { usd: 0.5 },
                'usd-coin': { usd: 1.0 },
                error: `Upstream error: ${res.status} ${res.statusText}`
            };
            return NextResponse.json(fallback, { status: 200 });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        console.error('Failed to fetch CoinGecko prices:', e);
        const fallback = {
            ethereum: { usd: 3400 },
            starknet: { usd: 0.5 },
            'usd-coin': { usd: 1.0 },
            error: 'Failed to fetch prices from CoinGecko'
        };
        return NextResponse.json(fallback, { status: 200 });
    }
}
