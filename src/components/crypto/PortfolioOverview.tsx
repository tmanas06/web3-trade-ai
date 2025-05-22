
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AssetAllocation {
  name: string;
  symbol: string;
  value: number;
  color: string;
  percentage: number;
}

const portfolioData = [
  { timestamp: '24h', value: 12450 },
  { timestamp: '3d', value: 11200 },
  { timestamp: '7d', value: 10800 },
  { timestamp: '14d', value: 9500 },
  { timestamp: '30d', value: 8300 },
  { timestamp: '90d', value: 5600 },
  { timestamp: '180d', value: 3200 },
];

const assetAllocation: AssetAllocation[] = [
  { name: 'Solana', symbol: 'SOL', value: 6780, color: '#9945FF', percentage: 45 },
  { name: 'Bitcoin', symbol: 'BTC', value: 3250, color: '#F7931A', percentage: 23 },
  { name: 'Ethereum', symbol: 'ETH', value: 2100, color: '#627EEA', percentage: 16 },
  { name: 'Cardano', symbol: 'ADA', value: 980, color: '#0033AD', percentage: 8 },
  { name: 'Others', symbol: 'VARIOUS', value: 1340, color: '#94A3B8', percentage: 8 },
];

export function PortfolioOverview() {
  const totalValue = assetAllocation.reduce((acc, asset) => acc + asset.value, 0);

  return (
    <Card className="glass-effect h-full">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg">Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-1">Total Value</div>
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          <div className="text-sm text-green-500">+$1,245.32 (11.2%) past month</div>
        </div>

        <div className="h-[180px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="timestamp" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#06B6D4" 
                strokeWidth={2}
                fill="url(#portfolioGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-4">Asset Allocation</div>
          <div className="space-y-3">
            {assetAllocation.map((asset) => (
              <div key={asset.symbol} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="h-4 w-4 rounded-full mr-2" 
                      style={{ backgroundColor: asset.color }}
                    ></div>
                    <span className="text-sm">{asset.name}</span>
                  </div>
                  <div className="text-sm font-medium">{asset.percentage}%</div>
                </div>
                <Progress value={asset.percentage} className="h-1" indicatorClassName={`bg-[${asset.color}]`} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
