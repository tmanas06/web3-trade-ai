import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TradeBar } from '@/components/trading/TradeBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Trading = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC/USDT');
  const cryptos = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT', 'VNST/vBTC'];
  const [activeTab, setActiveTab] = useState('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');

  return (
    <div className="flex-1 p-6 space-y-6 bg-[#0a0a0a] text-white">
      {/* Header with crypto selection */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trading</h1>
          <p className="text-muted-foreground">Trade cryptocurrencies with advanced tools</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {cryptos.map((crypto) => (
            <button
              key={crypto}
              onClick={() => setSelectedCrypto(crypto)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                selectedCrypto === crypto
                  ? 'bg-[#00ff88] text-black font-semibold'
                  : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300'
              }`}
            >
              {crypto}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Order Book */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">{selectedCrypto}</CardTitle>
                  <CardDescription className="text-gray-400">
                    ${(Math.random() * 100000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    <span className={`ml-2 ${Math.random() > 0.5 ? 'text-[#00ff88]' : 'text-red-500'}`}>
                      {Math.random() > 0.5 ? '+' : ''}{(Math.random() * 10).toFixed(2)}%
                    </span>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {['1H', '4H', '1D', '1W', '1M'].map((time) => (
                    <button key={time} className="px-2 py-1 text-xs rounded bg-[#1a1a1a] hover:bg-[#2a2a2a]">
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 bg-[#0a0a0a] flex items-center justify-center border-t border-[#1a1a1a]">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{selectedCrypto}</div>
                  <p className="text-gray-400">Interactive chart will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">Powered by TradingView</p>
                </div>
              </div>
            </CardContent>
          </Card>

          
          {/* Order Book */}
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle>Order Book</CardTitle>
              <CardDescription className="text-gray-400">Real-time order book for {selectedCrypto}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <div className="grid grid-cols-3 text-gray-400 text-xs pb-2 border-b border-[#1a1a1a]">
                  <span>Price (USDT)</span>
                  <span className="text-right">Size</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const isSell = i < 5;
                    const price = (100000 - Math.random() * 1000).toFixed(2);
                    const amount = (Math.random() * 5).toFixed(4);
                    const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);
                    
                    return (
                      <div key={i} className="grid grid-cols-3 py-1 text-sm hover:bg-[#1a1a1a]/50">
                        <span className={isSell ? 'text-red-500' : 'text-[#00ff88]'}>{price}</span>
                        <span className="text-right">{amount}</span>
                        <span className="text-right">{total}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Trade Form */}
        <div className="space-y-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <Tabs 
                defaultValue="limit" 
                className="w-full"
                onValueChange={(value) => setActiveTab(value as 'limit' | 'market')}
              >
                <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a] p-1 h-10">
                  <TabsTrigger 
                    value="limit" 
                    className={`${activeTab === 'limit' ? 'bg-[#00ff88] text-black' : 'text-gray-300'}`}
                  >
                    Limit
                  </TabsTrigger>
                  <TabsTrigger 
                    value="market" 
                    className={`${activeTab === 'market' ? 'bg-[#00ff88] text-black' : 'text-gray-300'}`}
                  >
                    Market
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button 
                      onClick={() => setSide('buy')}
                      className={`py-2 rounded-md font-medium transition-colors ${
                        side === 'buy' 
                          ? 'bg-[#00ff88] text-black' 
                          : 'bg-[#1a1a1a] text-[#00ff88] hover:bg-[#2a2a2a]'
                      }`}
                    >
                      Buy / Long
                    </button>
                    <button 
                      onClick={() => setSide('sell')}
                      className={`py-2 rounded-md font-medium transition-colors ${
                        side === 'sell' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-[#1a1a1a] text-red-500 hover:bg-[#2a2a2a]'
                      }`}
                    >
                      Sell / Short
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {activeTab === 'limit' && (
                      <div>
                        <label className="text-sm font-medium text-gray-300 block mb-1">Price (USDT)</label>
                        <input 
                          type="number" 
                          className="w-full p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-300">Amount ({selectedCrypto.split('/')[0]})</label>
                        <span className="text-xs text-gray-400">Available: 0.00</span>
                      </div>
                      <input 
                        type="number" 
                        className="w-full p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ff88]/50"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {[25, 50, 75, 100].map((percent) => (
                        <button 
                          key={percent}
                          className="p-2 text-xs bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded"
                        >
                          {percent}%
                        </button>
                      ))}
                      <button className="p-2 text-xs bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded">
                        Max
                      </button>
                    </div>
                    
                    <div className="pt-2 border-t border-[#1a1a1a]">
                      <div className="flex justify-between py-1 text-sm">
                        <span className="text-gray-400">Total</span>
                        <span>0.00 USDT</span>
                      </div>
                      <div className="flex justify-between py-1 text-sm">
                        <span className="text-gray-400">Fees (0.1%)</span>
                        <span>0.00 USDT</span>
                      </div>
                    </div>
                    
                    <button 
                      className={`w-full py-3 rounded-md font-medium text-white ${
                        side === 'buy' 
                          ? 'bg-gradient-to-r from-[#00ff88] to-[#00cc6a] hover:opacity-90' 
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90'
                      }`}
                    >
                      {side === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto.split('/')[0]}
                    </button>
                  </div>
                </div>
              </Tabs>
            </CardHeader>
          </Card>
          
          {/* Trade Bars */}
          <Card className="border-[#1a1a1a] bg-[#0f0f0f] overflow-hidden">
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#1a1a1a]">
                {cryptos.map((crypto) => (
                  <div 
                    key={crypto} 
                    className={`p-3 hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer ${
                      selectedCrypto === crypto ? 'bg-[#1a1a1a]' : ''
                    }`}
                    onClick={() => setSelectedCrypto(crypto)}
                  >
                    <TradeBar symbol={crypto} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trading;
