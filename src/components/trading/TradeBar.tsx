import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

interface PlatformPrice {
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  lastUpdated: string;
}

const fetchCryptoPrices = async (symbol: string): Promise<PlatformPrice[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockPrices: Record<string, PlatformPrice> = {
    binance: {
      name: 'Binance',
      price: 50000 + (Math.random() * 2000 - 1000), // Random price around $50k
      change24h: (Math.random() * 10 - 5), // Random change between -5% and 5%
      volume24h: 1000000000 + Math.random() * 1000000000, // Random volume
      lastUpdated: new Date().toISOString(),
    },
    coinbase: {
      name: 'Coinbase',
      price: 50000 + (Math.random() * 2000 - 1000),
      change24h: (Math.random() * 10 - 5),
      volume24h: 800000000 + Math.random() * 1000000000,
      lastUpdated: new Date().toISOString(),
    },
    kraken: {
      name: 'Kraken',
      price: 50000 + (Math.random() * 2000 - 1000),
      change24h: (Math.random() * 10 - 5),
      volume24h: 600000000 + Math.random() * 1000000000,
      lastUpdated: new Date().toISOString(),
    },
    okx: {
      name: 'OKX',
      price: 50000 + (Math.random() * 2000 - 1000),
      change24h: (Math.random() * 10 - 5),
      volume24h: 400000000 + Math.random() * 1000000000,
      lastUpdated: new Date().toISOString(),
    },
  };

  return Object.values(mockPrices);
};

interface TradeBarProps {
  symbol?: string;
  className?: string;
}

export function TradeBar({ symbol = 'BTC/USDT', className = '' }: TradeBarProps) {
  const [selectedCrypto, setSelectedCrypto] = useState(symbol);
  const [isOpen, setIsOpen] = useState(false);
  const cryptoOptions = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT'];

  const { data: prices, isLoading, error } = useQuery({
    queryKey: ['cryptoPrices', selectedCrypto],
    queryFn: () => fetchCryptoPrices(selectedCrypto),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`;
    }
    return `$${(volume / 1000000).toFixed(1)}M`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 inline" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 inline" />;
    return <ArrowRight className="h-4 w-4 inline" />;
  };

  return (
    <div className={`bg-card border-b border-border/40 shadow-sm z-10 ${className}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Crypto Selector */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-md hover:bg-muted/80 transition-colors text-foreground"
            >
              <span className="font-medium">{selectedCrypto}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-md shadow-lg">
                {cryptoOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedCrypto(option);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-muted ${selectedCrypto === option ? 'bg-muted' : ''} text-foreground`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))
            ) : error ? (
              <div className="col-span-4 text-center text-destructive">
                Failed to load prices
              </div>
            ) : (
              prices?.map((platform) => (
                <div key={platform.name} className="text-center md:text-left">
                  <div className="text-sm text-muted-foreground">{platform.name}</div>
                  <div className="font-medium text-foreground">
                    {formatPrice(platform.price)}
                    <span className={`ml-1 text-xs ${getChangeColor(platform.change24h)}`}>
                      {getChangeIcon(platform.change24h)}
                      {Math.abs(platform.change24h).toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Vol: {formatVolume(platform.volume24h)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Last Updated */}
          <div className="hidden md:block text-sm text-muted-foreground whitespace-nowrap">
            {prices && `Updated ${new Date(prices[0]?.lastUpdated).toLocaleTimeString()}`}
          </div>
        </div>
      </div>
    </div>
  );
}
