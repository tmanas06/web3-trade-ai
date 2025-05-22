
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';

interface Insight {
  type: 'bullish' | 'bearish' | 'warning' | 'info';
  title: string;
  description: string;
  asset?: string;
  confidence?: number;
}

const insights: Insight[] = [
  {
    type: 'bullish',
    title: 'Bullish pattern detected on SOL',
    description: 'Cup and handle pattern forming on the 4-hour chart suggests potential upward movement.',
    asset: 'SOL',
    confidence: 75
  },
  {
    type: 'info',
    title: 'Trading volume increasing',
    description: 'Market-wide trading volume has increased by 24% in the last 24 hours, indicating higher liquidity.',
  },
  {
    type: 'bearish',
    title: 'Resistance level approaching',
    description: 'BTC is approaching a strong resistance level at $53,200. Consider taking some profits.',
    asset: 'BTC',
    confidence: 68
  },
  {
    type: 'warning',
    title: 'Volatility alert',
    description: 'FOMC meeting scheduled in 2 days may cause increased market volatility.',
    confidence: 82
  },
];

export function AIInsights() {
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getInsightBgClass = (type: Insight['type']) => {
    switch (type) {
      case 'bullish':
        return 'bg-green-500/10 border-green-500/20';
      case 'bearish':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return '';
    }
  };

  return (
    <Card className="glass-effect h-full">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg">AI Market Insights</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${getInsightBgClass(insight.type)}`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">{getInsightIcon(insight.type)}</div>
                <div>
                  <div className="font-medium mb-1 flex items-center">
                    {insight.title}
                    {insight.asset && (
                      <span className="ml-2 text-xs py-0.5 px-1.5 rounded bg-white/10">
                        {insight.asset}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-300">{insight.description}</div>
                  {insight.confidence && (
                    <div className="text-xs text-gray-400 mt-1">
                      Confidence: {insight.confidence}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
