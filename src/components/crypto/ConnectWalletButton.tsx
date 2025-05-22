
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export function ConnectWalletButton() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const simulateWalletConnect = (walletType: string) => {
    // In a real app, this would connect to the actual wallet
    const mockAddress = '8xdt4GHpUiAMKvXLZYM1JMWVVUrhvZ7L7Fv5fBPjXUWE';
    setWalletAddress(mockAddress);
    setConnected(true);
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setConnected(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={connected ? "default" : "secondary"} 
          size="sm" 
          className={connected ? "bg-crypto-solana hover:bg-crypto-solana/90" : ""}
        >
          <Wallet className="h-4 w-4 mr-2" />
          {connected ? walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4) : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-effect border-none">
        <DialogHeader>
          <DialogTitle>{connected ? "Wallet Connected" : "Connect Your Wallet"}</DialogTitle>
        </DialogHeader>
        
        {!connected ? (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card className="cursor-pointer hover:border-crypto-accent/50 transition-all" onClick={() => simulateWalletConnect('phantom')}>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Phantom</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">Ph</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:border-crypto-accent/50 transition-all" onClick={() => simulateWalletConnect('solflare')}>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Solflare</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">Sf</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center">
                  <div className="h-6 w-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-xs">Ph</span>
                  </div>
                  Phantom Wallet
                </CardTitle>
                <CardDescription className="break-all">
                  {walletAddress}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive" 
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
