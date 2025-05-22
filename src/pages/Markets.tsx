
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Markets = () => {
  const markets = [
    { name: "BTC/USDT", price: "36,789.45", change: 2.4 },
    { name: "ETH/USDT", price: "2,456.78", change: 3.2 },
    { name: "SOL/USDT", price: "107.34", change: 5.7 },
    { name: "ADA/USDT", price: "0.59", change: -1.2 },
    { name: "AVAX/USDT", price: "45.67", change: 4.3 },
    { name: "MATIC/USDT", price: "1.23", change: -0.8 },
    { name: "DOT/USDT", price: "8.92", change: 1.7 },
    { name: "LINK/USDT", price: "14.56", change: 2.9 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Markets</h1>
      
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Live price updates from major exchanges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {markets.map((market) => (
              <Card key={market.name} className="bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{market.name}</h3>
                      <p className="text-xl font-bold">${market.price}</p>
                    </div>
                    <div className={`text-lg font-bold ${market.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {market.change >= 0 ? '+' : ''}{market.change}%
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="outline">Trade</Button>
                    <Button size="sm" variant="outline">View Chart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Markets;
