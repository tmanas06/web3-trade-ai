
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';

interface TradeRecommendation {
  type: 'buy' | 'sell';
  asset: string;
  price: number;
  targetPrice: number;
  stopLoss: number;
  reasoning: string;
  timeframe: string;
  potentialReturn: number;
}

const recommendations: TradeRecommendation[] = [
  {
    type: 'buy',
    asset: 'SOL',
    price: 135.84,
    targetPrice: 155.00,
    stopLoss: 125.00,
    reasoning: 'Breaking out of a descending wedge pattern with increasing volume.',
    timeframe: '1-2 weeks',
    potentialReturn: 14.1
  },
  {
    type: 'sell',
    asset: 'ADA',
    price: 0.58,
    targetPrice: 0.48,
    stopLoss: 0.63,
    reasoning: 'Double top formation and RSI divergence indicating a potential reversal.',
    timeframe: '1 week',
    potentialReturn: 17.2
  },
  {
    type: 'buy',
    asset: 'ETH',
    price: 3089.47,
    targetPrice: 3400.00,
    stopLoss: 2950.00,
    reasoning: 'Key support level holding with bullish engulfing candle on daily chart.',
    timeframe: '2-3 weeks',
    potentialReturn: 10.1
  }
];

export function TradingRecommendations() {
  return (
    <Card className="glass-effect h-full">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg">AI Trading Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/10">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div 
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {rec.type.toUpperCase()}
                  </div>
                  <div className="ml-2 font-medium text-lg">{rec.asset}</div>
                </div>
                <div className="text-sm text-gray-400">{rec.timeframe}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-400">Entry Price</div>
                  <div className="font-medium">${rec.price.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Target</div>
                  <div className={`font-medium ${rec.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    ${rec.targetPrice.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Stop Loss</div>
                  <div className="font-medium text-yellow-400">${rec.stopLoss.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Reasoning</div>
                <div className="text-sm">{rec.reasoning}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-400">Potential Return</div>
                  <div className={`font-medium ${rec.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {rec.potentialReturn.toFixed(1)}%
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-crypto-accent hover:text-crypto-accent/80">
                  Execute <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
