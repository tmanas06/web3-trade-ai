
import React from 'react';
import { DashboardMetrics } from '@/components/crypto/DashboardMetrics';
import { PortfolioOverview } from '@/components/crypto/PortfolioOverview';
import { MarketOverview } from '@/components/crypto/MarketOverview';
import { AIInsights } from '@/components/crypto/AIInsights';
import { TradingRecommendations } from '@/components/crypto/TradingRecommendations';
import { AIAssistant } from '@/components/layout/AIAssistant';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <DashboardMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <PortfolioOverview />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIInsights />
              <TradingRecommendations />
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-6">
            <MarketOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
