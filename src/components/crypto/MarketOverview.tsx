
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoAsset {
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

const marketData: CryptoAsset[] = [
  { name: 'Solana', symbol: 'SOL', price: 135.84, change: 5.67, volume: 2853000000 },
  { name: 'Bitcoin', symbol: 'BTC', price: 52489.63, change: 1.23, volume: 25690000000 },
  { name: 'Ethereum', symbol: 'ETH', price: 3089.47, change: 2.45, volume: 14580000000 },
  { name: 'Cardano', symbol: 'ADA', price: 0.58, change: -1.32, volume: 863000000 },
  { name: 'Solana', symbol: 'SOL', price: 135.84, change: 5.67, volume: 2853000000 },
  { name: 'Binance Coin', symbol: 'BNB', price: 583.12, change: 0.87, volume: 1936000000 },
  { name: 'XRP', symbol: 'XRP', price: 0.53, change: -0.43, volume: 1250000000 },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.12, change: 8.91, volume: 2145000000 },
];

export function MarketOverview() {
  return (
    <Card className="glass-effect h-full">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg">Market Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full">
            <thead className="bg-secondary/50 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Asset</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-300">Price</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-300">24h Change</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-300">Volume</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((asset, index) => (
                <tr 
                  key={`${asset.symbol}-${index}`} 
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center mr-2">
                        <span className="text-white font-semibold text-xs">{asset.symbol.slice(0, 1)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-gray-400">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <div className="flex items-center justify-end">
                      {asset.change >= 0 ? 
                        <TrendingUp className="h-4 w-4 mr-1" /> : 
                        <TrendingDown className="h-4 w-4 mr-1" />
                      }
                      {asset.change.toFixed(2)}%
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-300">
                    ${(asset.volume / 1000000).toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
