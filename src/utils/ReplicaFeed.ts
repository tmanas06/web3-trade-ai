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
  solanaDevnetBalance = 0,
  solanaDevnetUsd = 0,
  multiChainAssets = [],
  chainsMap = {},
  totalValue = "0"
}: {
  solanaDevnetBalance: number,
  solanaDevnetUsd: number,
  multiChainAssets: TokenAsset[],
  chainsMap: Record<string, string>,
  totalValue: string
}) {
  const hasAssets = solanaDevnetBalance > 0 || multiChainAssets.length > 0 || parseFloat(totalValue) > 0;
  
  if (!hasAssets) {
    return [
      "I'm new to cryptocurrency and DeFi. My wallet is currently empty.",
      "Please provide 3 beginner-friendly recommendations for:",
      "1. How to safely acquire my first crypto assets",
      "2. Basic DeFi concepts I should understand",
      "3. Best practices for wallet security",
      "Make the suggestions educational and suitable for complete beginners."
    ].join('\n');
  }

  const solanaSection = solanaDevnetBalance > 0
    ? `- SOL (Solana Devnet): ${solanaDevnetBalance.toFixed(4)} ($${(solanaDevnetUsd).toFixed(2)})`
    : "No Solana Devnet assets";

  const multiChainSection = multiChainAssets.length > 0
    ? multiChainAssets.map(token => 
        `- ${token.symbol} (${chainsMap[token.chainIndex] || 'Unknown'}): ` +
        `${parseFloat(token.balance).toFixed(4)} ($${(parseFloat(token.balance) * parseFloat(token.tokenPrice || '0')).toFixed(2)})`
      ).join('\n')
    : "No multi-chain assets";

  return [
    `Hey Drac, these are my assets:`,
    `Solana Devnet:`,
    solanaSection,
    `Multi-Chain Portfolio:`,
    multiChainSection,
    `Total Portfolio Value: $${parseFloat(totalValue).toFixed(2)}`,
    "",
    "Please provide 3 personalized recommendations for:",
    "1. Asset allocation improvements",
    "2. Potential earning opportunities",
    "3. Risk management strategies",
    "Format as numbered list with brief explanations."
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
