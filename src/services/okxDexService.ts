// src/services/okxDexService.ts

export interface DexToken {
  chainIndex: string;
  tokenContractAddress: string;
  symbol: string;
  name: string;
  logo?: string;
}
export interface AggregatorToken {
  decimals: string;
  tokenContractAddress: string;
  tokenLogoUrl: string;
  tokenName: string;
  tokenSymbol: string;
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

export interface SupportedChain {
  chainIndex: string;
  chainId: string;
  chainName: string;
  dexTokenApproveAddress: string;
}
export interface LiquiditySource {
  id: string;
  name: string;
  logo: string;
}

export interface ApproveTransactionData {
  data: string;
  dexContractAddress: string;
  gasLimit: string;
  gasPrice: string;
}

// Solana Swap Instruction Account Info
export interface SolanaSwapInstructionAccount {
  isSigner: boolean;
  isWritable: boolean;
  pubkey: string;
}

// Solana Swap Instruction
export interface SolanaSwapInstruction {
  data: string;
  accounts: SolanaSwapInstructionAccount[];
  programId: string;
}

// Solana Swap Instruction Response
export interface SolanaSwapInstructionResponse {
  addressLookupTableAddresses: string[];
  instructionLists: SolanaSwapInstruction[];
}
// Quote Response Interfaces
export interface DexProtocol {
  dexName: string;
  percent: string;
}

export interface SubRouter {
  dexProtocol: DexProtocol[];
  fromToken: DexToken;
  toToken: DexToken;
}

export interface DexRouter {
  router: string;
  routerPercent: string;
  subRouterList: SubRouter[];
}

export interface QuoteCompare {
  dexName: string;
  dexLogo: string;
  tradeFee: string;
  amountOut: string;
  priceImpactPercentage: string;
}

export interface DexQuoteResponse {
  chainIndex: string;
  chainId: string;
  dexRouterList: DexRouter[];
  estimateGasFee: string;
  fromToken: DexToken;
  fromTokenAmount: string;
  originToTokenAmount: string;
  priceImpactPercentage: string;
  quoteCompareList: QuoteCompare[];
  toToken: DexToken;
  toTokenAmount: string;
  tradeFee: string;
}

// Swap Transaction Data Interface
export interface SwapTxData {
  data: string;
  from: string;
  gas: string;
  gasPrice: string;
  maxPriorityFeePerGas?: string;
  minReceiveAmount: string;
  signatureData: string[];
  to: string;
  value: string;
}

// Full Swap Response Interface
export interface SwapResponse {
  routerResult: {
    chainIndex: string;
    chainId: string;
    dexRouterList: DexRouter[];
    estimateGasFee: string;
    fromToken: DexToken;
    fromTokenAmount: string;
    priceImpactPercentage: string;
    quoteCompareList: QuoteCompare[];
    toToken: DexToken;
    toTokenAmount: string;
    tradeFee: string;
  };
  tx: SwapTxData;
}

// Transaction Token Details Interface
export interface TransactionTokenDetails {
  amount: string;
  symbol: string;
  tokenAddress: string;
}

// Transaction History Response Interface
export interface TransactionHistoryResponse {
  chainIndex: string;
  chainId: string;
  txHash: string;
  height: string;
  txTime: string;
  status: 'pending' | 'success' | 'fail';
  txType: 'Approve' | 'Wrap' | 'Unwrap' | 'Swap';
  fromAddress: string;
  dexRouter: string;
  toAddress: string;
  fromTokenDetails: TransactionTokenDetails;
  toTokenDetails: TransactionTokenDetails;
  referralAmount: string;
  errorMsg: string;
  gasLimit: string;
  gasUsed: string;
  gasPrice: string;
  txFee: string;
}
export interface SupportedBlockchain {
  name: string;
  logoUrl: string;
  shortName: string;
  chainIndex: string;
}

// Interface for total value response
export interface TotalValueByAddress {
  totalValue: string; // USD value as string
}

// Interface for a single token asset
export interface TokenAsset {
  chainIndex: string;
  tokenAddress: string;
  address: string;
  symbol: string;
  balance: string;
  rawBalance: string;
  tokenPrice: string;
  tokenType: string; // "1" = token, "2" = inscription
  transferAmount: string;
  availableAmount: string;
  isRiskToken: boolean;
}

// Interface for the token address input
export interface TokenAddressQuery {
  chainIndex: string;
  tokenAddress: string; // "" for native, or contract address
}

// Interface for a single token asset (already defined)
export interface TokenAsset {
  chainIndex: string;
  tokenAddress: string;
  address: string;
  symbol: string;
  balance: string;
  rawBalance: string;
  tokenPrice: string;
  tokenType: string;
  transferAmount: string;
  availableAmount: string;
  isRiskToken: boolean;
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
export async function fetchSupportedChains(chainIndex?: string): Promise<SupportedChain[]> {
  const params = new URLSearchParams();
  if (chainIndex) params.append('chainIndex', chainIndex);

  const requestPath = `/dex/aggregator/supported/chain${params.toString() ? '?' + params.toString() : ''}`;

  console.log('[fetchSupportedChains] Request URL:', `${OKX_BASE}${requestPath}`);

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchSupportedChains] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchSupportedChains] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchSupportedChains] Raw data:', data);

  return (data.data || []) as SupportedChain[];
}

export async function fetchAllTokens(chainIndex: string): Promise<AggregatorToken[]> {
  const params = new URLSearchParams({ chainIndex });
  const requestPath = `/dex/aggregator/all-tokens?${params}`;

  console.log('[fetchAllTokens] Request URL:', `${OKX_BASE}${requestPath}`);

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchAllTokens] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchAllTokens] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchAllTokens] Raw data:', data);

  return (data.data || []) as AggregatorToken[];
}


// Fetch all liquidity sources for a given chainIndex
export async function fetchLiquiditySources(chainIndex: string): Promise<LiquiditySource[]> {
  const params = new URLSearchParams({ chainIndex });
  const requestPath = `/dex/aggregator/get-liquidity?${params}`;

  console.log('[fetchLiquiditySources] Request URL:', `${OKX_BASE}${requestPath}`);

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchLiquiditySources] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchLiquiditySources] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchLiquiditySources] Raw data:', data);

  return (data.data || []) as LiquiditySource[];
}

// Fetch ERC-20 Approval Transaction Data
export async function fetchApproveTransaction(
  chainIndex: string,
  tokenContractAddress: string,
  approveAmount: string
): Promise<ApproveTransactionData> {
  const params = new URLSearchParams({
    chainIndex,
    tokenContractAddress,
    approveAmount
  });

  const requestPath = `/dex/aggregator/approve-transaction?${params}`;

  console.log('[fetchApproveTransaction] Request:', requestPath);

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchApproveTransaction] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchApproveTransaction] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`Approval Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchApproveTransaction] Response data:', data);

  // Return first item from array response
  return (data.data?.[0] || {}) as ApproveTransactionData;
}

// Fetch Solana swap instructions for a given swap
export async function fetchSolanaSwapInstructions(params: {
  chainIndex: string;
  amount: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  slippage: string;
  userWalletAddress: string;
  [key: string]: string | undefined;
}): Promise<SolanaSwapInstructionResponse> {
  const urlParams = new URLSearchParams(params as Record<string, string>);
  const requestPath = `/dex/aggregator/swap-instruction?${urlParams}`;

  console.log('[fetchSolanaSwapInstructions] Request URL:', `${OKX_BASE}${requestPath}`);

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchSolanaSwapInstructions] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchSolanaSwapInstructions] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchSolanaSwapInstructions] Raw data:', data);

  return data.data as SolanaSwapInstructionResponse;
}
// Fetch Swap Quote
export async function fetchQuote(params: {
  chainIndex: string;
  amount: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  dexIds?: string;
  priceImpactProtectionPercentage?: string;
  feePercent?: string;
}): Promise<DexQuoteResponse> {
  const urlParams = new URLSearchParams(params as Record<string, string>);
  const requestPath = `/dex/aggregator/quote?${urlParams}`;

  console.log('[fetchQuote] Requesting quote:', urlParams.toString());

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchQuote] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchQuote] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`Quote Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchQuote] Raw response:', data);

  // Return first item from array response
  return data.data?.[0] as DexQuoteResponse;
}

// Execute Swap
export async function fetchSwap(params: {
  chainIndex: string;
  amount: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  slippage: string;
  userWalletAddress: string;
  swapReceiverAddress?: string;
  feePercent?: string;
  gasLevel?: 'average' | 'fast' | 'slow';
  // ... other optional params
}): Promise<SwapResponse> {
  const urlParams = new URLSearchParams(params as Record<string, string>);
  const requestPath = `/dex/aggregator/swap?${urlParams}`;

  console.log('[fetchSwap] Requesting swap:', urlParams.toString());

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchSwap] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchSwap] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`Swap Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchSwap] Raw response:', data);

  return data.data?.[0] as SwapResponse;
}

// Fetch Transaction History
export async function fetchTransactionHistory(params: {
  chainIndex: string;
  txHash: string;
  isFromMyProject?: boolean;
}): Promise<TransactionHistoryResponse> {
 const urlParams = new URLSearchParams();
  urlParams.append('chainIndex', params.chainIndex);
  urlParams.append('txHash', params.txHash);
  
  if (typeof params.isFromMyProject !== 'undefined') {
    urlParams.append('isFromMyProject', params.isFromMyProject.toString());
  }  const requestPath = `/dex/aggregator/history?${urlParams}`;

  console.log('[fetchTransactionHistory] Requesting history:', urlParams.toString());

  const res = await fetch(`${OKX_BASE}${requestPath}`);
  console.log('[fetchTransactionHistory] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchTransactionHistory] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`Transaction History Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchTransactionHistory] Raw response:', data);

  return data.data as TransactionHistoryResponse;
}

// Fetch all supported blockchains
export async function fetchSupportedBlockchains(): Promise<SupportedBlockchain[]> {
  const requestPath = '/wallet/chain/supported-chains';
  const res = await fetch(`${OKX_BASE}${requestPath}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('[fetchSupportedBlockchains] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchSupportedBlockchains] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchSupportedBlockchains] Raw data:', data);

  return (data.data || []) as SupportedBlockchain[];
}

// Fetch total value of all tokens/DeFi assets for a given address and chains
export async function fetchTotalValueByAddress(
  address: string,
  chains: string,
  assetType: string = '0',
  excludeRiskToken: boolean = true
): Promise<TotalValueByAddress> {
  const params = new URLSearchParams({
    address,
    chains,
    assetType,
    excludeRiskToken: excludeRiskToken.toString()
  });

  const requestPath = `/wallet/asset/total-value-by-address?${params}`;
  const res = await fetch(`${OKX_BASE}${requestPath}`, {
    headers: { 'Content-Type': 'application/json' }
  });

  console.log('[fetchTotalValueByAddress] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchTotalValueByAddress] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchTotalValueByAddress] Raw data:', data);

  // Return the first item in the data array (API returns data: [{ totalValue: ... }])
  return (data.data?.[0] || { totalValue: '0' }) as TotalValueByAddress;
}

// Fetch all token balances for an address across chains
export async function fetchAllTokenBalancesByAddress(
  address: string,
  chains: string, // comma-separated chain indices, e.g. "1,137"
  filter: string = "0" // "0" = filter risky tokens, "1" = do not filter
): Promise<TokenAsset[]> {
  const params = new URLSearchParams({
    address,
    chains,
    filter
  });

  const requestPath = `/wallet/asset/all-token-balances-by-address?${params}`;
  const res = await fetch(`${OKX_BASE}${requestPath}`, {
    headers: { 'Content-Type': 'application/json' }
  });

  console.log('[fetchAllTokenBalancesByAddress] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchAllTokenBalancesByAddress] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('[fetchAllTokenBalancesByAddress] Raw data:', data);

  // API returns data: [{ tokenAssets: [...] }]
  return (data.data?.[0]?.tokenAssets || []) as TokenAsset[];
}

// Fetch specific token balances for an address
export async function fetchSpecificTokenBalances(
  address: string,
  tokenAddresses: TokenAddressQuery[],
  filter: string = "0"
): Promise<TokenAsset[]> {
  const res = await fetch(`${OKX_BASE}/wallet/asset/token-balances-by-address`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, tokenAddresses, filter }),
  });

  console.log('[fetchSpecificTokenBalances] Response status:', res.status);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('[fetchSpecificTokenBalances] API Error:', {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      errorBody,
    });
    throw new Error(`API Error: ${res.status} ${res.statusText}\n${errorBody}`);
  }

  const data = await res.json();
  // API returns data: [{ tokenAssets: [...] }]
  return (data.data?.[0]?.tokenAssets || []) as TokenAsset[];
}
