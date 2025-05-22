
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Circle } from "lucide-react";

export function PortfolioOverview() {
  const portfolioData = {
    totalValue: 12432.87,
    change24h: 3.2,
    assets: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        value: 5300.21,
        allocation: 42.6,
        price: 34250.32,
        change24h: 2.8,
        color: "text-yellow-500"
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        value: 3712.45,
        allocation: 29.9,
        price: 2250.15,
        change24h: 4.2,
        color: "text-indigo-400"
      },
      {
        name: "Solana",
        symbol: "SOL",
        value: 2450.67,
        allocation: 19.7,
        price: 102.18,
        change24h: 5.7,
        color: "text-crypto-solana"
      },
      {
        name: "Cardano",
        symbol: "ADA",
        value: 969.54,
        allocation: 7.8,
        price: 0.58,
        change24h: -1.2,
        color: "text-blue-400"
      }
    ]
  };

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Your asset allocation and performance</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          Details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Value</div>
            <div className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">24h Change</div>
            <div className={`text-xl font-bold flex items-center justify-end ${portfolioData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioData.change24h >= 0 ? 
                <TrendingUp className="h-5 w-5 mr-1" /> : 
                <TrendingDown className="h-5 w-5 mr-1" />
              }
              {portfolioData.change24h}%
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {portfolioData.assets.map((asset) => (
            <div key={asset.symbol} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Circle className={`h-3 w-3 mr-2 fill-current ${asset.color}`} />
                  <span className="font-medium">{asset.name}</span>
                  <span className="text-xs text-muted-foreground ml-1">({asset.symbol})</span>
                </div>
                <div className="text-sm font-medium">{asset.allocation}%</div>
              </div>
              <Progress value={asset.allocation} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <div>${asset.value.toLocaleString()}</div>
                <div className={`${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {asset.change24h >= 0 ? '↑' : '↓'} {Math.abs(asset.change24h)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm">Buy Assets</Button>
        <Button variant="outline" size="sm">Send / Receive</Button>
      </CardFooter>
    </Card>
  );
}
