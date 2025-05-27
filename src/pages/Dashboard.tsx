import React from 'react';
import { DracChat } from '@/components/crypto/DracChat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, TrendingUp, ArrowUp, ArrowDown, Clock, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  // Mock data - replace with real API data
  const stats = [
    { 
      title: 'Portfolio Value', 
      value: '$24,892.12', 
      change: '+2.5%', 
      isPositive: true,
      icon: <TrendingUp className="h-5 w-5 text-green-500" />
    },
    { 
      title: '24h Change', 
      value: '+$582.40', 
      change: '+2.5%', 
      isPositive: true,
      icon: <Activity className="h-5 w-5 text-blue-500" />
    },
    { 
      title: 'Active Trades', 
      value: '12', 
      change: '+3', 
      isPositive: true,
      icon: <BarChart className="h-5 w-5 text-purple-500" />
    },
    { 
      title: 'AI Confidence', 
      value: '87%', 
      change: '+5%', 
      isPositive: true,
      icon: <LineChart className="h-5 w-5 text-amber-500" />
    },
  ];

  const topMovers = [
    { symbol: 'BTC/USDT', price: '$62,340.50', change: '+3.2%', isPositive: true },
    { symbol: 'ETH/USDT', price: '$3,402.10', change: '+1.8%', isPositive: true },
    { symbol: 'SOL/USDT', price: '$142.30', change: '+5.7%', isPositive: true },
    { symbol: 'XRP/USDT', price: '$0.5234', change: '-0.8%', isPositive: false },
  ];

  const recentTrades = [
    { id: 1, pair: 'BTC/USDT', type: 'Buy', amount: '0.25', price: '$61,230.50', time: '2 min ago', status: 'Completed' },
    { id: 2, pair: 'ETH/USDT', type: 'Sell', amount: '1.5', price: '$3,380.20', time: '15 min ago', status: 'Completed' },
    { id: 3, pair: 'SOL/USDT', type: 'Buy', amount: '10', price: '$138.75', time: '1 hour ago', status: 'Completed' },
  ];

  const aiInsights = [
    { 
      id: 1, 
      title: 'Bullish Signal Detected', 
      description: 'Strong buy signal for BTC based on RSI and MACD indicators',
      type: 'success',
      time: '5 min ago'
    },
    { 
      id: 2, 
      title: 'High Volatility Warning', 
      description: 'Unusual trading volume detected in ETH/USDT pair',
      type: 'warning',
      time: '25 min ago'
    },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left: Main dashboard content */}
      <div className="w-1/2 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold">Dashboard & AI</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your portfolio.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-xs ${stat.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {stat.change}
                  {stat.isPositive ? 
                    <ArrowUp className="h-3 w-3 ml-1" /> : 
                    <ArrowDown className="h-3 w-3 ml-1" />
                  }
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Real-time market data and trends</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Updated just now
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovers.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors">
                  <div className="font-medium">{item.symbol}</div>
                  <div className="text-right">
                    <div>{item.price}</div>
                    <div className={`text-xs ${item.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Your latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${trade.type === 'Buy' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      {trade.type === 'Buy' ? 
                        <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" /> : 
                        <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      }
                    </div>
                    <div>
                      <div className="font-medium">{trade.pair}</div>
                      <div className="text-sm text-muted-foreground">{trade.amount} {trade.pair.split('/')[0]}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{trade.price}</div>
                    <div className="text-xs text-muted-foreground">{trade.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: AI Chat and Insights */}
      <div className="w-1/2 h-full flex flex-col bg-gradient-to-br from-[#6c63ff] to-[#4e54c8] rounded-l-2xl overflow-hidden">
        <div className="p-6 text-white">
          <h2 className="text-xl font-bold mb-1">AI Trading Assistant</h2>
          <p className="text-sm text-white/80">Get real-time insights and make informed trading decisions</p>
          
          {/* AI Insights */}
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-white/90">Latest AI Insights</h3>
            {aiInsights.map((insight) => (
              <div key={insight.id} className="bg-white/10 p-4 rounded-lg">
                <div className="flex items-start">
                  {insight.type === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-medium">{insight.title}</div>
                    <p className="text-sm text-white/70 mt-1">{insight.description}</p>
                    <div className="text-xs text-white/50 mt-2">{insight.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <DracChat />
        </div>
      </div>
    </div>
  );
}
