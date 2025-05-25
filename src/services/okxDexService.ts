// src/services/okxDexService.ts

export interface DexToken {
  chainIndex: string;
  tokenContractAddress: string;
  symbol: string;
  name: string;
  logo?: string;
}

export interface DexMarketData {
  chainIndex: string;
  tokenContractAddress: string;
  price: string;
  marketCap: string;
  priceChange24H: string;
  volume24H: string;
  time: string;
}

export interface DexCandle {
  ts: string;
  o: string;
  h: string;
  l: string;
  c: string;
  vol: string;
  volUsd: string;
  confirm: string;
}

export interface DexTrade {
  id: string;
  chainIndex: string;
  tokenContractAddress: string;
  txHashUrl: string;
  userAddress: string;
  dexName: string;
  poolLogoUrl: string;
  type: string;
  changedTokenInfo: Array<{
    amount: string;
    tokenSymbol: string;
    tokenContractAddress: string;
  }>;
  price: string;
  volume: string;
  time: string;
}

export const OKX_BASE = 'http://localhost:3001';

export async function fetchBatchTokenPrices(tokens: DexToken[]): Promise<DexMarketData[]> {
  const requestPath = '/dex/market/price-info';
  const payload = tokens.map((t) => ({
    chainIndex: t.chainIndex,
    tokenContractAddress: t.tokenContractAddress,
  }));

  console.log('[fetchBatchTokenPrices] Request payload:', JSON.stringify(payload, null, 2));

  const res = await fetch(`${OKX_BASE}${requestPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('[fetchBatchTokenPrices] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchBatchTokenPrices] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`Price API Error ${res.status}: ${res.statusText}\n${errorBody}`);
  }

  const data = await res.json();
  console.log('[fetchBatchTokenPrices] Raw OKX Response:', data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.data || []).map((item: any) => {
    console.log('[fetchBatchTokenPrices] Processing item:', item);

    return {
      chainIndex: item.chainIndex,
      tokenContractAddress: item.tokenContractAddress,
      price: item.price || "0",
      marketCap: item.marketCap || "0",
      priceChange24H: item.priceChange24H || "0",
      volume24H: item.volume24H || "0",
      time: new Date(parseInt(item.time)).toISOString(),
    };
  });
}

export async function fetchCandles(
  chainIndex: string,
  tokenContractAddress: string,
  bar = "1H",
  limit = 24
): Promise<DexCandle[]> {
  const params = new URLSearchParams({
    chainIndex,
    tokenContractAddress,
    bar,
    limit: limit.toString(),
  });

  const requestPath = `/dex/market/candles?${params}`;

  console.log('[fetchCandles] Request URL:', `${OKX_BASE}${requestPath}`);

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchCandles] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchCandles] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchCandles] Raw data:', data);

  return (data.data || []).map((c: string[]) => {
    console.log('[fetchCandles] Processing candle:', c);
    return {
      ts: c[0],
      o: c[1],
      h: c[2],
      l: c[3],
      c: c[4],
      vol: c[5],
      volUsd: c[6],
      confirm: c[7],
    };
  });
}

export async function fetchTrades(
  chainIndex: string,
  tokenContractAddress: string,
  limit = 10
): Promise<DexTrade[]> {
  const params = new URLSearchParams({
    chainIndex,
    tokenContractAddress,
    limit: limit.toString(),
    order: 'desc', // Most recent first
  });

  const requestPath = `/dex/market/trades?${params}`;

  console.log('[fetchTrades] Request URL:', `${OKX_BASE}${requestPath}`);

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchTrades] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchTrades] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchTrades] Raw data:', data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.data || []).map((item: any) => {
    console.log('[fetchTrades] Processing item:', item);

    return {
      id: item.id,
      chainIndex: item.chainIndex,
      tokenContractAddress: item.tokenContractAddress,
      txHashUrl: item.txHashUrl,
      userAddress: item.userAddress,
      dexName: item.dexName,
      poolLogoUrl: item.poolLogoUrl,
      type: item.type,
      changedTokenInfo: item.changedTokenInfo,
      price: item.price,
      volume: item.volume,
      time: new Date(parseInt(item.time)).toISOString(),
    };
  });
}
