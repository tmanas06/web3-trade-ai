// contexts/WalletContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any[];
  loading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connection = new Connection(
    // Option 1: Use devnet for testing
    clusterApiUrl('devnet'),
    
    // Option 2: Use Helius (free tier)
    // 'https://rpc.helius.xyz/?api-key=YOUR_API_KEY',
    
    // Option 3: Use QuickNode (free tier)
    // 'https://your-endpoint.solana-mainnet.quiknode.pro/YOUR_TOKEN/',
    
    // Option 4: Use GenesysGo
    // 'https://ssc-dao.genesysgo.net/'
  );


 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const handleAccountsChanged = (publicKey: any) => {
  console.log('[Wallet] Account changed:', publicKey);
  
  if (publicKey) {
    // ✅ Fix: Ensure we convert to string properly
    const addressString = typeof publicKey === 'string' 
      ? publicKey 
      : publicKey.toBase58?.() || publicKey.toString?.() || '';
      
    console.log('[Wallet] Setting address:', addressString);
    setWalletAddress(addressString);
    fetchWalletData(addressString);
  } else {
    disconnect();
  }
};

  const handleDisconnect = () => {
    setConnected(false);
    setWalletAddress(null);
    setBalance(0);
    setTransactions([]);
  };

  useEffect(() => {
    const provider = window.okxwallet?.solana;
    if (!provider) return;

    provider.on('connect', (publicKey: string) => {
      setConnected(true);
      handleAccountsChanged(publicKey);
    });

    provider.on('disconnect', handleDisconnect);
    provider.on('accountChanged', handleAccountsChanged);

    return () => {
      provider.removeListener('connect', handleAccountsChanged);
      provider.removeListener('disconnect', handleDisconnect);
      provider.removeListener('accountChanged', handleAccountsChanged);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWalletData = async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const publicKey = new PublicKey(address);
      const balanceInLamports = await connection.getBalance(publicKey);
      setBalance(balanceInLamports / 1e9);
      
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 });
      setTransactions(signatures);
      
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const connect = async () => {
    try {
      const provider = window.okxwallet?.solana;
      if (!provider) {
        window.open('https://www.okx.com/web3', '_blank');
        throw new Error('OKX Wallet not detected');
      }

      console.log('[Wallet] Connecting to OKX...');
    const response = await provider.connect();
    console.log('[Wallet] Connection response:', response);
    
    setConnected(true);
    
    // ✅ Fix: Properly extract address string
    const addressString = response.publicKey?.toBase58?.() || response.publicKey?.toString?.() || '';
    console.log('[Wallet] Extracted address:', addressString);
    
    handleAccountsChanged(addressString);
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  const disconnect = async () => {
    try {
      await window.okxwallet?.solana?.disconnect();
      handleDisconnect();
    } catch (err) {
      console.error('Disconnection error:', err);
      setError('Failed to disconnect wallet');
    }
  };

  return (
    <WalletContext.Provider value={{
      connected,
      walletAddress,
      balance,
      connect,
      disconnect,
      transactions,
      loading,
      error
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
