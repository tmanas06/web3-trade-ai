// components/Wallet.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, Repeat, Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const Wallet = () => {
  const { 
    connected, 
    walletAddress, 
    balance, 
    transactions, 
    loading, 
    error, 
    connect, 
    disconnect 
  } = useWallet();

  const formatAddress = (address: string | null) => {
    if (!address || typeof address !== 'string') {
      console.warn('[Wallet] Invalid address type:', typeof address, address);
      return '';
    }
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => 
    new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">OKX Wallet</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <WalletIcon className="h-5 w-5 mr-2" />
                OKX Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {connected ? (
                    <Card className="bg-secondary/30 border-crypto-accent">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">OKX Wallet</p>
                            <p className="font-mono text-xs mt-1">
                              {formatAddress(walletAddress || '')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">{balance.toFixed(4)} SOL</div>
                            <div className="text-sm text-muted-foreground">
                              ${(balance * 150).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">OKX Wallet not connected</p>
                      <Button onClick={connect}>
                        <WalletIcon className="mr-2 h-4 w-4" />
                        Connect OKX Wallet
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex space-x-2 mt-6">
                <Button className="flex-1" size="sm" disabled={!connected}>
                  <ArrowDownToLine className="mr-2 h-4 w-4" /> Receive
                </Button>
                <Button className="flex-1" size="sm" disabled={!connected}>
                  <ArrowUpFromLine className="mr-2 h-4 w-4" /> Send
                </Button>
                <Button className="flex-1" size="sm" variant="outline" disabled={!connected}>
                  <Repeat className="mr-2 h-4 w-4" /> Swap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transactions panel remains the same */}
      </div>
    </div>
  );
};

export default Wallet;
