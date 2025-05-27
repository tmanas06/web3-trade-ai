import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Data = () => {
  const { 
    connected, 
    walletAddress, 
    transactions, 
    loading, 
    error, 
    connect 
  } = useWallet();

  if (!connected) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Wallet Not Connected</CardTitle>
            <CardDescription>
              Connect your wallet to view transaction history
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={connect}>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Wallet: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            {transactions.length > 0 
              ? `Showing ${transactions.length} most recent transactions` 
              : 'No transactions found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading transactions</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div 
                  key={tx.signature || index}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm break-all">
                          {tx.signature?.slice(0, 20)}...{tx.signature?.slice(-8)}
                        </span>
                        <a 
                          href={`https://solscan.io/tx/${tx.signature}?cluster=devnet`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tx.blockTime && formatDistanceToNow(new Date(tx.blockTime * 1000), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {tx.slot ? `Slot: ${tx.slot}` : 'Confirmed'}
                      </span>
                    </div>
                  </div>
                  {tx.memo && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                      <p className="font-medium">Memo:</p>
                      <p className="break-all">{tx.memo}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found for this wallet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Data;
