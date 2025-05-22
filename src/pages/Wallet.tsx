
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, Repeat } from 'lucide-react';

const Wallet = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <WalletIcon className="h-5 w-5 mr-2" />
                My Wallets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="bg-secondary/30 border-crypto-accent">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Phantom Wallet</p>
                        <p className="font-mono text-xs mt-1">8xdt4...7L7Fv5fBPjXUWE</p>
                      </div>
                      <div className="text-xl font-bold">$8,246.32</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">OKX Wallet</p>
                        <p className="font-mono text-xs mt-1">0x42b...9a3F</p>
                      </div>
                      <div className="text-xl font-bold">$4,186.55</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex space-x-2 mt-6">
                <Button className="flex-1" size="sm">
                  <ArrowDownToLine className="mr-2 h-4 w-4" /> Receive
                </Button>
                <Button className="flex-1" size="sm">
                  <ArrowUpFromLine className="mr-2 h-4 w-4" /> Send
                </Button>
                <Button className="flex-1" size="sm" variant="outline">
                  <Repeat className="mr-2 h-4 w-4" /> Swap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <p className="font-medium">Received SOL</p>
                      <p className="text-xs text-muted-foreground">May 21, 2025</p>
                    </div>
                    <div className="text-green-500">+0.5 SOL</div>
                  </div>
                ))}
                
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <p className="font-medium">Sent USDC</p>
                    <p className="text-xs text-muted-foreground">May 20, 2025</p>
                  </div>
                  <div className="text-red-500">-125 USDC</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
