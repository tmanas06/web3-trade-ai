// components/MarketDetailModal.tsx
import React, { useEffect, useState } from "react";
import { DexToken, fetchCandles, fetchTrades, DexCandle, DexTrade } from "@/services/okxDexService";
import MarketSparkline from "./MarketSparkLine";

interface Props {
  token: DexToken;
  onClose: () => void;
}

const MarketDetailModal: React.FC<Props> = ({ token, onClose }) => {
  const [candles, setCandles] = useState<DexCandle[]>([]);
  const [trades, setTrades] = useState<DexTrade[]>([]);
  
  useEffect(() => {
    fetchCandles(token.chainIndex, token.tokenContractAddress, "1H", 48).then(setCandles);
    fetchTrades(token.chainIndex, token.tokenContractAddress, 10).then(setTrades);
  }, [token]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative border border-gray-200 dark:border-gray-700">
        {/* Enhanced Close Button */}
        <button 
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 transition-all duration-200 hover:rotate-90"
          onClick={onClose}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {token.name} ({token.symbol})
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Token Details & Trading Activity</p>
        </div>

        {/* Price Chart Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Price Chart (48h)
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <MarketSparkline
              data={candles.map(c => parseFloat(c.c))}
              width={400}
              height={80}
              color="#3b82f6"
            />
          </div>
        </div>

        {/* Recent Trades Section */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Recent Trades
          </h3>
          <div className="max-h-48 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {trades.length > 0 ? trades.map((t, index) => (
              <div key={t.id} className={`flex items-center gap-3 p-3 text-sm border-b border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : ''}`}>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  t.type === "buy" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                  {t.type.toUpperCase()}
                </span>
                <span className="text-gray-700 dark:text-gray-300 flex-1">
                  {parseFloat(t.changedTokenInfo[0]?.amount || "0").toFixed(4)} {t.changedTokenInfo[0]?.tokenSymbol}
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  @ ${parseFloat(t.price).toFixed(4)}
                </span>
                <a 
                  href={t.txHashUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline text-xs transition-colors"
                >
                  View Tx
                </a>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No recent trades available
              </div>
            )}
          </div>
        </div>

        {/* Footer Tip */}
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
          <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start">
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span><strong>Tip:</strong> Market cap represents the total value of all tokens in circulation. Volume shows the total amount traded in the last 24 hours.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailModal;
