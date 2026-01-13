import { NextResponse } from 'next/server';

export async function GET() {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,starknet,usd-coin&vs_currencies=usd';
    try {
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return new NextResponse(JSON.stringify({ error: `Upstream error: ${res.status} ${res.statusText} ${text}` }), { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch prices from CoinGecko' }), { status: 502 });
    }
}
