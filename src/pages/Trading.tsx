import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TradeBar } from '@/components/trading/TradeBar';

const Trading = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC/USDT');
  const cryptos = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trading</h1>
        <div className="flex space-x-2">
          {cryptos.map((crypto) => (
            <button
              key={crypto}
              onClick={() => setSelectedCrypto(crypto)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedCrypto === crypto
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {crypto}
            </button>
          ))}
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{selectedCrypto} Trading View</CardTitle>
          <CardDescription>Real-time price and trading data</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Price Chart Placeholder */}
          <div className="h-64 bg-muted/50 flex items-center justify-center">
            <p className="text-muted-foreground">Price Chart</p>
          </div>
          
          {/* Trade Bars */}
          <div className="divide-y">
            <TradeBar symbol={selectedCrypto} />
            
            {/* Additional Trade Bars for Comparison */}
            {cryptos
              .filter(crypto => crypto !== selectedCrypto)
              .map((crypto) => (
                <div key={crypto} className="opacity-70 hover:opacity-100 transition-opacity">
                  <TradeBar symbol={crypto} className="border-0" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Order Book and Trade Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="grid grid-cols-3 text-muted-foreground text-xs pb-2 border-b">
                <span>Price (USDT)</span>
                <span className="text-right">Size</span>
                <span className="text-right">Total</span>
              </div>
              {/* Order book rows would go here */}
              <div className="text-center py-4 text-muted-foreground">
                Order book data will appear here
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select className="w-full p-2 border rounded">
                    <option>Limit</option>
                    <option>Market</option>
                    <option>Stop-Limit</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Side</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-green-500/10 text-green-500 p-2 rounded">
                      Buy
                    </button>
                    <button className="bg-red-500/10 text-red-500 p-2 rounded">
                      Sell
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Price (USDT)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Amount ({selectedCrypto.split('/')[0]})</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Total (USDT)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded"
                    placeholder="0.00"
                    readOnly
                  />
                </div>
              </div>
              
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium">
                Place Order
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Trading;
