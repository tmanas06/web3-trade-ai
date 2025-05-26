// ReplicaFeed.ts

import { TokenAsset } from "@/services/okxDexService";
import { DexQuoteResponse, AggregatorToken } from "@/services/okxDexService";

// Helper to format a single token asset for the prompt
function formatTokenAsset(token: TokenAsset, chainName: string) {
  const bal = parseFloat(token.balance);
  const usd = token.tokenPrice && parseFloat(token.tokenPrice) > 0
    ? `$${(bal * parseFloat(token.tokenPrice)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "no price";
  const risk = token.isRiskToken ? " [RISK]" : "";
  return `- ${token.symbol} (${chainName}): ${bal.toLocaleString(undefined, { maximumFractionDigits: 8 })} (${usd})${risk}`;
}

// Main portfolio formatter
export function formatPortfolioPrompt({
  solanaDevnetBalance,
  solanaDevnetUsd,
  multiChainAssets,
  chainsMap,
  totalValue
}: {
  solanaDevnetBalance: number,
  solanaDevnetUsd: number,
  multiChainAssets: TokenAsset[],
  chainsMap: Record<string, string>,
  totalValue: string
}) {
  // Solana Devnet
  const solanaSection = solanaDevnetBalance > 0
    ? `- SOL (Solana Devnet): ${solanaDevnetBalance.toLocaleString(undefined, { maximumFractionDigits: 8 })} ($${solanaDevnetUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })})`
    : "No Solana Devnet assets";

  // Multi-chain tokens
  const multiChainSection = multiChainAssets.length > 0
    ? multiChainAssets.map(token => formatTokenAsset(token, chainsMap[token.chainIndex] || "Unknown")).join('\n')
    : "No multi-chain assets";

  // Total value
  const totalValueSection = totalValue && parseFloat(totalValue) > 0
    ? `Total multi-chain portfolio value: $${parseFloat(totalValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "Total multi-chain portfolio value: $0";

  // Final prompt
  return [
    `Hey drac, these are my assets:`,
    "",
    `Solana Devnet:`,
    solanaSection,
    "",
    `Multi-Chain Portfolio:`,
    multiChainSection,
    "",
    totalValueSection,
    "",
    "I need suggestions, my assets are idle, what to do?"
  ].join('\n');
}

// Helper to format a swap/quote for the AI
export function formatSwapPrompt({
  fromToken,
  toToken,
  amount,
  quote
}: {
  fromToken: AggregatorToken | null,
  toToken: AggregatorToken | null,
  amount: string,
  quote: DexQuoteResponse | null
}) {
  if (!fromToken || !toToken || !amount || !quote) {
    return "I'm considering a swap but I don't have all the details yet.";
  }

  const route = quote.dexRouterList
    .map(r =>
      r.subRouterList
        .map(s => s.dexProtocol.map(p => p.dexName).join(", "))
        .join(", ")
    )
    .join(", ");

  return [
    `Hey drac, I'm thinking about swapping:`,
    `- ${amount} ${fromToken.tokenSymbol} → ${toToken.tokenSymbol}`,
    "",
    `Here's the swap quote info:`,
    `• Expected to receive: ${quote.toTokenAmount} ${toToken.tokenSymbol}`,
    `• Estimated fee: $${quote.tradeFee}`,
    `• Route: ${route || "unknown"}`,
    `• Price impact: ${quote.priceImpactPercentage}`,
    "",
    "What do you think about this swap? Can you explain what this means and if it's a good idea?"
  ].join('\n');
}
