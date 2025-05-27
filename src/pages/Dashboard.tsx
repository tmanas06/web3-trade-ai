import React, { useState } from 'react';
import { DracChat } from '@/components/crypto/DracChat';
import Wallet from "./Wallet";
import { useAiSuggestions } from "@/contexts/AiSuggestionsContext";

export default function Dashboard() {
  const { aiContent } = useAiSuggestions();

  // Split the AI content into lines and filter for numbered suggestions (1., 2., 3.)
  const suggestionLines = aiContent
    ? aiContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => /^\d+\./.test(line))
    : [];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-black">
      {/* Left: Main dashboard content with AI Trading Assistant */}
      <div className="w-1/2 p-8 space-y-8 overflow-y-auto bg-black">
        {/* AI Trading Assistant Section */}
        <div className="bg-gradient-to-br from-[#1a1f2e] to-[#1e691b] rounded-2xl p-6 border border-[#00ff88]/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-8 bg-gradient-to-b from-[#00ff88] to-[#00cc6a] rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">AI Trading Assistant</h2>
          </div>
          <p className="text-gray-300 mb-6">Get real-time insights and make informed trading decisions</p>
          
          <h3 className="text-xl font-semibold text-[#00ff88] mb-4">Latest AI Insights</h3>
          
          {/* AI Insights Cards */}
          <div className="space-y-4">
            <div className="bg-[#0a0a0a]/80 border border-[#00ff88]/20 rounded-xl p-4 hover:border-[#00ff88]/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400 font-semibold">Bullish Signal Detected</span>
              </div>
              <p className="text-gray-300 text-sm">Strong buy signal for BTC based on RSI and MACD indicators</p>
              <span className="text-xs text-gray-500">5 min ago</span>
            </div>
            
            <div className="bg-[#0a0a0a]/80 border border-yellow-500/20 rounded-xl p-4 hover:border-yellow-500/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-400 font-semibold">High Volatility Warning</span>
              </div>
              <p className="text-gray-300 text-sm">Unusual trading volume detected in ETH/USDT pair</p>
              <span className="text-xs text-gray-500">25 min ago</span>
            </div>
          </div>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#00ff88]/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-sm">Portfolio Value</span>
              <div className="w-4 h-4 text-[#00ff88]">📈</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">$24,892.12</div>
            <div className="text-[#00ff88] text-sm">+2.5% ↗</div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#00ff88]/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-sm">24h Change</span>
              <div className="w-4 h-4 text-[#00ff88]">📊</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">+$582.40</div>
            <div className="text-[#00ff88] text-sm">+2.5% ↗</div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#00ff88]/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-sm">Active Trades</span>
              <div className="w-4 h-4 text-[#00ff88]">📋</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">12</div>
            <div className="text-[#00ff88] text-sm">+3 ↗</div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#00ff88]/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-sm">AI Confidence</span>
              <div className="w-4 h-4 text-[#00ff88]">🎯</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">87%</div>
            <div className="text-[#00ff88] text-sm">+5% ↗</div>
          </div>
        </div>

        {/* Market Overview */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Market Overview</h3>
            <span className="text-xs text-gray-500">Updated just now</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
              <span className="text-white font-medium">BTC/USDT</span>
              <div className="text-right">
                <div className="text-white font-bold">$62,340.50</div>
                <div className="text-[#00ff88] text-sm">+3.2%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
              <span className="text-white font-medium">ETH/USDT</span>
              <div className="text-right">
                <div className="text-white font-bold">$3,402.10</div>
                <div className="text-[#00ff88] text-sm">+1.8%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-white font-medium">SOL/USDT</span>
              <div className="text-right">
                <div className="text-white font-bold">$142.30</div>
                <div className="text-red-400 text-sm">-5.7%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Drac's Suggestions */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-[#00ff88] to-[#00cc6a] rounded-full"></div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Drac's Suggestions</h2>
          </div>
          
          {suggestionLines.length > 0 ? (
            <div className="space-y-4">
              {suggestionLines.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="group relative bg-[#161a1e] border border-[#1a1a1a] rounded-xl p-4 
                           hover:border-[#00ff88]/30 hover:shadow-lg hover:shadow-[#00ff88]/10 
                           transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl 
                                  bg-gradient-to-br from-[#00ff88] to-[#00cc6a] 
                                  shadow-lg shadow-[#00ff88]/20">
                      <span className="text-black font-bold text-sm">{idx + 1}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">Suggestion {idx + 1}</h4>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {suggestion.replace(/^\d+\.\s*/, '')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-[#00cc6a]/20 
                            flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ready for AI Insights</h3>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Connect your wallet to unlock personalized DeFi recommendations from Drac
              </p>
              <div className="mt-3 px-4 py-2 rounded-full border border-[#00ff88]/30 text-[#00ff88] text-sm">
                Powered by AI
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Full Chat Section */}
      <div className="w-1/2 h-full">
        <DracChat />
      </div>
    </div>
  );
}
