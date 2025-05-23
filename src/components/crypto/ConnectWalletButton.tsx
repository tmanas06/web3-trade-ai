import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    solana?: any;
    phantom?: {
      solana: any;
    };
  }
}

export function ConnectWalletButton() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState<any>(null);
  const [open, setOpen] = useState(false);

  // Check if Phantom is installed
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.phantom?.solana || window.solana?.isPhantom)) {
      setProvider(window.phantom?.solana || window.solana);
      
      // Check if already connected
      if (window.phantom?.solana?.isConnected) {
        handleConnect();
      }
    }
  }, []);

  const handleConnect = async () => {
    try {
      if (!provider) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await provider.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      setConnected(true);
      setOpen(false);
      
      // Listen for account changes
      provider.on('disconnect', () => {
        setConnected(false);
        setWalletAddress('');
      });
      
      provider.on('accountChanged', (publicKey: any) => {
        if (publicKey) {
          setWalletAddress(publicKey.toString());
        } else {
          setConnected(false);
          setWalletAddress('');
        }
      });
      
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (provider && provider.disconnect) {
        await provider.disconnect();
      }
      setConnected(false);
      setWalletAddress('');
      setOpen(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const shortAddress = walletAddress 
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={connected ? "outline" : "default"}
          className={connected ? "bg-background hover:bg-accent" : ""}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {connected ? shortAddress : 'Connect Wallet'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {connected ? 'Wallet Connected' : 'Connect Wallet'}
          </DialogTitle>
          <DialogDescription>
            {connected 
              ? 'Your wallet is connected to the application.'
              : 'Connect your wallet to continue.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {connected ? (
            <Card>
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
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
          ) : (
            <Button 
              onClick={handleConnect}
              className="w-full py-6 flex items-center justify-center gap-2"
            >
              <img 
                src="https://phantom.app/favicon.ico" 
                alt="Phantom" 
                className="h-6 w-6"
              />
              Connect with Phantom
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
