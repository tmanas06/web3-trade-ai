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
      {/* Left: Main dashboard content */}
      <div className="w-1/2 p-8 space-y-8 overflow-y-auto bg-black">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-gradient-to-b from-[#00ff88] to-[#00cc6a] rounded-full"></div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Drac's Suggestions</h1>
        </div>
        
        {suggestionLines.length > 0 ? (
          <div className="space-y-6">
            {suggestionLines.map((suggestion, idx) => (
              <div
                key={idx}
                className="group relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 
                         hover:border-[#00ff88]/30 hover:shadow-lg hover:shadow-[#00ff88]/10 
                         transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/5 to-[#00ff88]/0 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl 
                                  bg-gradient-to-br from-[#00ff88] to-[#00cc6a] 
                                  shadow-lg shadow-[#00ff88]/20">
                      <span className="text-black font-bold text-lg">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">Suggestion {idx + 1}</h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-[#00ff88] to-transparent"></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed text-base">
                    {suggestion.replace(/^\d+\.\s*/, '')}
                  </p>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/5 to-[#00ff88]/0 
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00ff88]/20 to-[#00cc6a]/20 
                          flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Ready for AI Insights</h3>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Connect your wallet to unlock personalized DeFi recommendations from Drac
            </p>
            <div className="mt-4 px-6 py-2 rounded-full border border-[#00ff88]/30 text-[#00ff88] text-sm">
              Powered by AI
            </div>
          </div>
        )}
      </div>

      {/* Right: Drac Chat */}
      <div className="w-1/2 h-full flex flex-col">
        <DracChat />
      </div>
    </div>
  );
}
