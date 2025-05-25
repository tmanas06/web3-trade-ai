import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { TickerData, fetchPopularPairs } from '@/services/okxService';

// List of popular trading pairs to display
const POPULAR_PAIRS = [
  'BTC-USDT',
  'ETH-USDT',
  'SOL-USDT',
  'XRP-USDT',
  'ADA-USDT',
  'AVAX-USDT',
  'DOT-USDT',
  'MATIC-USDT',
  'LINK-USDT',
  'DOGE-USDT',
  'ATOM-USDT',
  'LTC-USDT',
];

interface MarketData extends TickerData {
  change24h: number;
  formattedPrice: string;
  loading: boolean;
  error?: string;
}

const Markets = () => {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadMarketData = async () => {
    console.log('[Markets] Loading market data...');
    setIsLoading(true);
    setError(null);
    
    try {
      // Set initial loading state for all markets
      setMarkets(POPULAR_PAIRS.map(pair => ({
        instId: pair,
        last: '0',
        lastSz: '0',
        askPx: '0',
        askSz: '0',
        bidPx: '0',
        bidSz: '0',
        open24h: '0',
        high24h: '0',
        low24h: '0',
        volCcy24h: '0',
        vol24h: '0',
        sodUtc0: '0',
        sodUtc8: '0',
        ts: '0',
        change24h: 0,
        formattedPrice: '...',
        loading: true
      })));

      // Fetch all tickers at once
      console.log('[Markets] Fetching tickers...');
      const tickers = await fetchPopularPairs(POPULAR_PAIRS);
      console.log('[Markets] Fetched tickers:', tickers);
      
      // Update state with fetched data
      setMarkets(POPULAR_PAIRS.map(pair => {
        const ticker = tickers.find(t => t.instId === pair);
        
        if (!ticker) {
          return {
            instId: pair,
            last: '0',
            lastSz: '0',
            askPx: '0',
            askSz: '0',
            bidPx: '0',
            bidSz: '0',
            open24h: '0',
            high24h: '0',
            low24h: '0',
            volCcy24h: '0',
            vol24h: '0',
            sodUtc0: '0',
            sodUtc8: '0',
            ts: '0',
            change24h: 0,
            formattedPrice: '--',
            loading: false,
            error: 'Failed to load data'
          };
        }
        
        const change24h = parseFloat(ticker.last) - parseFloat(ticker.open24h);
        const changePercent = (change24h / parseFloat(ticker.open24h)) * 100;
        
        return {
          ...ticker,
          change24h: isNaN(changePercent) ? 0 : changePercent,
          formattedPrice: parseFloat(ticker.last).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
          }),
          loading: false
        };
      }));
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[Markets] Error loading market data:', err);
      setError('Failed to load market data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(loadMarketData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    loadMarketData();
  };

  if (isLoading && markets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-crypto-accent" />
        <p className="text-lg">Loading market data...</p>
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Markets</h1>
          <p className="text-sm text-muted-foreground">
            Real-time cryptocurrency prices
            {lastUpdated && (
              <span className="ml-2">• Updated {lastUpdated.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading market data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {markets.map((market) => {
          const isPositive = market.change24h >= 0;
          const isLoading = market.loading;
          const hasError = !!market.error;
          
          return (
            <Card 
              key={market.instId} 
              className={`bg-secondary/30 transition-all hover:bg-secondary/40 ${
                isLoading ? 'opacity-70' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-medium">{market.instId.replace('-', '/')}</h3>
                    <p className="text-xl font-bold">
                      {isLoading ? '...' : hasError ? '--' : `$${market.formattedPrice}`}
                    </p>
                  </div>
                  <div 
                    className={`text-lg font-bold ${
                      hasError ? 'text-amber-500' : 
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {hasError ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : isLoading ? (
                      '...'
                    ) : (
                      `${isPositive ? '+' : ''}${market.change24h.toFixed(2)}%`
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    disabled={isLoading || hasError}
                    asChild
                  >
                    <Link to={`/trading?pair=${market.instId}`}>
                      Trade
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    disabled={isLoading || hasError}
                    asChild
                  >
                    <Link to={`/chart/${market.instId}`}>
                      Chart
                    </Link>
                  </Button>
                </div>
                {hasError && (
                  <p className="mt-2 text-xs text-amber-500 text-center">
                    {market.error}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Data provided by OKX • Updates every 30 seconds</p>
        <p className="mt-1">
          {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
        </p>
      </div>
    </div>
  );
};

export default Markets;
