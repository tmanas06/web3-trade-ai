// pages/Markets.tsx
import React, { useEffect, useState } from "react";
import {
  DexToken,
  DexMarketData,
  fetchBatchTokenPrices,
  fetchCandles,
} from "@/services/okxDexService";
import MarketSparkline from "@/components/MarketSparkLine";
import MarketDetailModal from "@/components/MarketDetailModal";

const TOKENS: DexToken[] = [
  { chainIndex: "1", tokenContractAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", symbol: "ETH", name: "Ethereum" },
  { chainIndex: "1", tokenContractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7", symbol: "USDT", name: "Tether USD" },
  { chainIndex: "1", tokenContractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", symbol: "USDC", name: "USD Coin" },
  { chainIndex: "1", tokenContractAddress: "0x6b175474e89094c44da98b954eedeac495271d0f", symbol: "DAI", name: "Dai" },
  { chainIndex: "1", tokenContractAddress: "0x514910771af9ca656af840dff83e8264ecf986ca", symbol: "LINK", name: "Chainlink" },
  { chainIndex: "1", tokenContractAddress: "0x8c3ee4f778e282b59d42d693a97b80b1edfa5b34", symbol: "VNST", name: "VNST" },
  { chainIndex: "1", tokenContractAddress: "0x5fbdb2315678afecb367f032d93f642f64180aa3", symbol: "vBTC", name: "vBTC" },
];

const Markets: React.FC = () => {
  const [marketData, setMarketData] = useState<DexMarketData[]>([]);
  const [sparklines, setSparklines] = useState<{ [k: string]: number[] }>({});
  const [selectedToken, setSelectedToken] = useState<DexToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBatchTokenPrices(TOKENS).then((data) => {
      setMarketData(data);
      Promise.all(
        TOKENS.map((t) =>
          fetchCandles(t.chainIndex, t.tokenContractAddress, "1H", 24).then((candles) => ({
            key: `${t.chainIndex}:${t.tokenContractAddress}`,
            data: candles.map((c) => parseFloat(c.c)),
          }))
        )
      ).then((all) => {
        const sparkObj: { [k: string]: number[] } = {};
        all.forEach((s) => {
          sparkObj[s.key] = s.data;
        });
        setSparklines(sparkObj);
        setLoading(false);
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Markets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Real-time DeFi token prices, trends, and activity across chains.
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-300">Token</th>
                  <th className="p-4 text-right font-semibold text-gray-700 dark:text-gray-300">Price</th>
                  <th className="p-4 text-right font-semibold text-gray-700 dark:text-gray-300">24h Change</th>
                  <th className="p-4 text-right font-semibold text-gray-700 dark:text-gray-300">Market Cap</th>
                  <th className="p-4 text-right font-semibold text-gray-700 dark:text-gray-300">24h Volume</th>
                  <th className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300">Trend</th>
                  <th className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300">Details</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((m, idx) => {
                  const token = TOKENS[idx];
                  const sparkKey = `${token.chainIndex}:${token.tokenContractAddress}`;
                  const priceChange = parseFloat(m.priceChange24H || "0");
                  
                  return (
                    <tr 
                      key={sparkKey} 
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{token.symbol}</span>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">
                        ${parseFloat(m.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </td>
                      <td className={`p-4 text-right font-bold ${
                        priceChange >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          priceChange >= 0 
                            ? "bg-green-100 dark:bg-green-900/30" 
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}>
                          {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">
                        {m.marketCap === "N/A" ? (
                          <span className="text-gray-500">N/A</span>
                        ) : (
                          `$${parseFloat(m.marketCap).toLocaleString(undefined, { notation: "compact" })}`
                        )}
                      </td>
                      <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">
                        {m.volume24H === "N/A" ? (
                          <span className="text-gray-500">N/A</span>
                        ) : (
                          `$${parseFloat(m.volume24H).toLocaleString(undefined, { notation: "compact" })}`
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 inline-block">
                          <MarketSparkline data={sparklines[sparkKey] || []} />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                          onClick={() => setSelectedToken(token)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-blue-600">
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-medium">Loading market data...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedToken && (
        <MarketDetailModal token={selectedToken} onClose={() => setSelectedToken(null)} />
      )}
    </div>
  );
};

export default Markets;
